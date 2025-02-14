import { Input } from "@/design-system/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/design-system/select";
import { Block } from "@/types/swimlane";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";
import flatMap from "lodash/flatMap";
import keys from "lodash/keys";

interface FilterBarProps {
  blocks: Block[];
  onFilterChange: (filters: Record<string, string>) => void;
}

export function FilterBar({ blocks, onFilterChange }: FilterBarProps) {
  const attributes = uniq(flatMap(blocks, (block) => keys(block.attributes)));

  if (isEmpty(blocks)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 w-full md:flex-row md:items-center">
      <Input
        placeholder="Search by title..."
        className="w-full md:max-w-xs"
        onChange={(e) => onFilterChange({ title: e.target.value })}
      />
      {attributes.map((attr) => (
        <Select
          key={attr}
          onValueChange={(value) => onFilterChange({ [attr]: value })}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={`Filter by ${attr}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Array.from(
              new Set(blocks.map((block) => block.attributes[attr]))
            ).map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
