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
import { Separator } from "@/design-system/separator";
import { isEmpty } from "lodash";
import { Card, CardContent } from "@/design-system/card";
import {
  convertCamelCaseToString,
  getFormattedTaskLabel,
} from "@/helperMethods/task";

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
        <DialogHeader></DialogHeader>
        <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col px-4">
          <div className="flex flex-row items-center justify-between mt-4">
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
          </div>
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
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
            </div>

            <Separator />

            {!isEmpty(block.transitions) && (
              <div className="flex flex-1 flex-col gap-2 overflow-hidden">
                <h4 className="text-sm font-medium">Transition History</h4>
                <div className="flex-1 overflow-auto flex flex-col gap-4">
                  {block.transitions?.map((transition) => (
                    <Card key={transition.id}>
                      <CardContent className="p-4">
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
                          <span>
                            {getFormattedTaskLabel(transition.fromState)}
                          </span>
                          <MoveRight className="h-4 w-4 shrink-0" />
                          <span>
                            {getFormattedTaskLabel(transition.toState)}
                          </span>
                        </div>
                        <div className="mt-1 text-sm">
                          {Object.entries(transition.data).map(
                            ([key, value]) => (
                              <div key={key}>
                                <span className="text-muted-foreground">
                                  {convertCamelCaseToString(key)}:
                                </span>{" "}
                                <span>{value}</span>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
