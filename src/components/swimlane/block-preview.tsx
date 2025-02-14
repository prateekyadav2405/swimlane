import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/design-system/dialog";
import { Block } from "@/types/swimlane";
import { format } from "date-fns";
import { Clock, MoveRight, Pencil } from "lucide-react";
import { Button } from "@/design-system/button";
import { ScrollArea } from "@/design-system/scroll-area";
import { Separator } from "@/design-system/separator";
import { isEmpty } from "lodash";

interface BlockPreviewProps {
  block: Block | null;
  isEditing: boolean;
  onClose: () => void;
  onUpdate: (block: Block) => void;
}

export function BlockPreview({ block, onClose, onUpdate }: BlockPreviewProps) {
  if (!block) return null;

  return (
    <>
      <Dialog open={!!block} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col px-4">
          <DialogHeader className="flex flex-row items-center justify-between mt-4">
            <DialogTitle className="line-clamp-2 flex-1">
              {block.title}
            </DialogTitle>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => onUpdate(block)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {block.description}
                </p>

                <div>
                  <h4 className="text-sm font-medium mb-2">Attributes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(block.attributes)?.map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-muted-foreground capitalize">
                          {key}:
                        </span>{" "}
                        <span className="capitalize">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {block.startDate && (
                    <p className="text-sm">
                      Start Date:{" "}
                      <span className="font-semibold">{block.startDate}</span>
                    </p>
                  )}
                  {block.reviewer && (
                    <p className="text-sm">
                      Reviewer:{" "}
                      <span className="font-semibold">{block.reviewer}</span>
                    </p>
                  )}
                  {block.completionDate && (
                    <p className="text-sm">
                      Completion Date:{" "}
                      <span className="font-semibold">
                        {block.completionDate}
                      </span>
                    </p>
                  )}
                </div>

                {!isEmpty(block.transitions) && (
                  <div>
                    <Separator />
                    <h4 className="text-sm font-medium mb-2">
                      Transition History
                    </h4>
                    <div className="space-y-4">
                      {block.transitions?.map((transition) => (
                        <div key={transition.id} className="relative">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm font-medium">
                              {format(
                                new Date(transition.timestamp),
                                "MMM d, yyyy HH:mm"
                              )}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{transition.fromState}</span>
                            <MoveRight className="h-4 w-4 shrink-0" />
                            <span>{transition.toState}</span>
                          </div>
                          <div className="mt-1 text-sm">
                            {Object.entries(transition.data).map(
                              ([key, value]) => (
                                <div key={key}>
                                  <span className="text-muted-foreground">
                                    {key}:
                                  </span>{" "}
                                  <span>{value}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
