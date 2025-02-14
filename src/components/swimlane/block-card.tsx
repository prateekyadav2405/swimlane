import { Card, CardContent, CardHeader, CardTitle } from "@/design-system/card";
import { cn } from "@/lib/utils";
import { Block } from "@/types/swimlane";
import { Clock, GripHorizontal, User } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/design-system/badge";

interface BlockCardProps {
  block: Block;
  onClick: () => void;
}

export function BlockCard({ block, onClick }: BlockCardProps) {
  const timestamp = block.updated_at
    ? format(new Date(block.updated_at), "MMM d, HH:mm")
    : "No updates";

  return (
    <Card
      className={cn(
        "mb-3 cursor-move bg-card shadow-sm hover:shadow-md transition-shadow",
        "active:shadow-lg active:scale-[0.98] transition-transform"
      )}
      onClick={onClick}
    >
      <CardHeader className="p-3 flex flex-row items-center space-y-0">
        <CardTitle className="text-sm flex-1 font-medium line-clamp-1">
          {block.title}
        </CardTitle>
        <GripHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {block.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {Object.entries(block.attributes).map(([key, value]) => (
            <Badge key={key} className="capitalize">
              {key}: {value}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 shrink-0" />
            {timestamp}
          </div>
          {block.created_by_email && (
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1 shrink-0" />
              {block.created_by_email.email.split("@")[0]}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
