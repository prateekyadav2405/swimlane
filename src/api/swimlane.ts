import { createTask, getTasks, updateTask } from "@/services/tasks";
import { Block } from "@/types/swimlane";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTasks = () => {
  return useQuery<Block[], Error>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: Block) => updateTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
