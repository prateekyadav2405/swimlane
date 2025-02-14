import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/design-system/dialog";
import { Input } from "@/design-system/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/design-system/select";
import { Button } from "@/design-system/button";
import { Lane } from "@/types/swimlane";
import { useState } from "react";

const TransitionTypeNameMapping = {
  todo: "To-Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

interface TransitionFormProps {
  fromState: string;
  toState: string;
  lane: Lane;
  onSubmit: (data: Record<string, string>) => void;
  onCancel: () => void;
}

export function TransitionForm({
  fromState,
  toState,
  lane,
  onSubmit,
  onCancel,
}: TransitionFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formattedFromState =
    TransitionTypeNameMapping[
      fromState as keyof typeof TransitionTypeNameMapping
    ];
  const formattedToState =
    TransitionTypeNameMapping[
      toState as keyof typeof TransitionTypeNameMapping
    ];

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Move from {formattedFromState} to {formattedToState}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {lane.requiredFields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-foreground mb-1.5 block"
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <Select
                  value={formData[field.name]}
                  onValueChange={(value) =>
                    setFormData({ ...formData, [field.name]: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  className="w-full"
                />
              )}
            </div>
          ))}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
