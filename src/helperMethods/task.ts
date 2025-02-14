import { TransitionTypeNameMapping } from "@/types/swimlane";

export const getFormattedTaskLabel = (task: string): string => {
  return TransitionTypeNameMapping[
    task as keyof typeof TransitionTypeNameMapping
  ];
};

export const convertCamelCaseToString = (input: string): string => {
  return input
    .replace(/\b[a-z]/g, (char) => char.toUpperCase())
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\./g, " ");
};
