import { useState, useEffect } from "react";
import { Block, Lane, SwimlaneConfig } from "@/types/swimlane";
import { BlockCard } from "./block-card";
import { BlockPreview } from "./block-preview";
import { TransitionForm } from "./transition-form";
import { FilterBar } from "./filter-bar";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/design-system/button";
import { Plus } from "lucide-react";
import { TaskForm } from "./task-form";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useCreateTask, useGetTasks, useUpdateTask } from "@/api/swimlane";

interface SwimlaneProps {
  config: SwimlaneConfig;
}

export function Swimlane({ config }: SwimlaneProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isTaskModal, setIsTaskModal] = useState(false);
  const [blockToEdit, setBlockToEdit] = useState<Block | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [transitionBlock, setTransitionBlock] = useState<{
    block: Block;
    fromState: string;
    toState: string;
    lane: Lane;
  } | null>(null);

  const { data: tasks = [] } = useGetTasks();

  const {
    mutateAsync: createTask,
    isPending: isCreatingTask,
    isSuccess: isCreateTaskSuccess,
    error: createTaskError,
  } = useCreateTask();

  const {
    mutateAsync: updateTask,
    isPending: isUpdatingTask,
    isSuccess: isUpdateTaskSuccess,
    error: updateTaskError,
  } = useUpdateTask();

  const filteredBlocks = tasks.filter((block) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === "all") return true;
      if (key === "title") {
        return block.title.toLowerCase().includes(value.toLowerCase());
      }
      return block.attributes[key] === value;
    });
  });

  const onDragEndHandler = (result: DropResult) => {
    if (!result.destination) return;

    const blockId = result.draggableId;
    const fromState = result.source.droppableId;
    const toState = result.destination.droppableId;

    if (fromState === toState) return;

    const block = tasks.find((b) => b.id === blockId);
    const lane = config.lanes.find((l) => l.id === toState);

    if (!block || !lane) return;

    if (!lane.allowedTransitionsTo.includes(fromState)) {
      toast({
        variant: "destructive",
        title: "Invalid transition",
        description: `Cannot move items from ${fromState} to ${toState}`,
      });
      return;
    }

    setTransitionBlock({
      block,
      fromState,
      toState,
      lane,
    });
  };

  const onTransitionSubmitHandler = (data: Record<string, string>) => {
    if (!transitionBlock) return;

    updateTask({
      ...transitionBlock.block,
      state: transitionBlock.toState,
      ...data,
    });
  };

  const onFormSubmitHandler = (task: Block) => {
    if (task.id) {
      updateTask(task);
    } else {
      createTask(task);
    }
  };

  const onEditClickHandler = (task: Block) => {
    setBlockToEdit(task);
    setIsTaskModal(true);
  };

  useEffect(() => {
    if (isUpdateTaskSuccess) {
      setIsTaskModal(false);
      setTransitionBlock(null);
      toast({
        title: "Task updated",
        description: "Task has been successfully updated",
      });
    }
  }, [isUpdateTaskSuccess, toast]);

  useEffect(() => {
    if (updateTaskError) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          updateTaskError instanceof Error
            ? updateTaskError.message
            : "An error occurred",
      });
    }
  }, [updateTaskError, toast]);

  useEffect(() => {
    if (isCreateTaskSuccess) {
      setIsTaskModal(false);
      toast({
        title: "Task created",
        description: "New task has been added to the board",
      });
    }
  }, [isCreateTaskSuccess, toast]);

  useEffect(() => {
    if (createTaskError) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          createTaskError instanceof Error
            ? createTaskError.message
            : "An error occurred",
      });
    }
  }, [createTaskError, toast]);

  useEffect(() => {
    const channel = supabase.channel("public:tasks").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tasks",
      },
      (payload) => {
        queryClient.setQueryData(["tasks"], (oldData: Block[]) => {
          if (!oldData) return [payload.new];

          const newBlock = payload.new as Block;
          return oldData.map((task) =>
            task.id === newBlock.id ? newBlock : task
          );
        });
      }
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <FilterBar blocks={tasks} onFilterChange={setFilters} />
        <Button
          onClick={() => setIsTaskModal(true)}
          size="sm"
          className="w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEndHandler}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {config.lanes.map((lane) => (
            <div key={lane.id} className="bg-muted rounded-lg p-4">
              <h3 className="font-medium mb-4">{lane.title}</h3>
              <Droppable droppableId={lane.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px]"
                  >
                    {filteredBlocks
                      .filter((block) => block.state === lane.id)
                      .map((block, index) => (
                        <Draggable
                          key={block.id}
                          draggableId={block.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <BlockCard
                                block={block}
                                onClick={() => setSelectedBlock(block)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <BlockPreview
        block={selectedBlock}
        onClose={() => setSelectedBlock(null)}
        onUpdate={onEditClickHandler}
        isEditing={isUpdatingTask}
      />

      {transitionBlock && (
        <TransitionForm
          fromState={transitionBlock.fromState}
          toState={transitionBlock.toState}
          lane={transitionBlock.lane}
          onSubmit={onTransitionSubmitHandler}
          onCancel={() => setTransitionBlock(null)}
        />
      )}

      <TaskForm
        open={isTaskModal}
        onOpenChange={setIsTaskModal}
        onSubmit={onFormSubmitHandler}
        lanes={config.lanes}
        initialData={blockToEdit}
        isLoading={isCreatingTask || isUpdatingTask}
      />
    </div>
  );
}
