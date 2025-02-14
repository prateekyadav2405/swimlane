import { SwimlaneConfig } from "@/types/swimlane";
import { Swimlane } from "../swimlane/swimlane";
import { AppMenu } from "../app-menu";

const config: SwimlaneConfig = {
  lanes: [
    {
      id: "todo",
      title: "To Do",
      allowedTransitionsTo: ["in_progress"],
      requiredFields: [
        {
          name: "assignee",
          label: "Assignee",
          type: "text",
        },
        {
          name: "priority",
          label: "Priority",
          type: "select",
          options: ["Low", "Medium", "High"],
        },
      ],
    },
    {
      id: "in_progress",
      title: "In Progress",
      allowedTransitionsTo: ["todo", "review"],
      requiredFields: [
        {
          name: "startDate",
          label: "Start Date",
          type: "date",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      allowedTransitionsTo: ["in_progress", "done"],
      requiredFields: [
        {
          name: "reviewer",
          label: "Reviewer",
          type: "text",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      allowedTransitionsTo: ["review"],
      requiredFields: [
        {
          name: "completionDate",
          label: "Completion Date",
          type: "date",
        },
      ],
    },
  ],
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <AppMenu />
      <main className="container mx-auto p-4">
        <Swimlane config={config} />
      </main>
    </div>
  );
}
