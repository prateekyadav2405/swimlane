import { Moon, Sun } from "lucide-react";
import { Button } from "@/design-system/button";
import useAppState from "@/state/app";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/design-system/tooltip";

export function ThemeToggle() {
  const theme = useAppState((state) => state.theme);
  const setTheme = useAppState((state) => state.setTheme);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Sun /> : <Moon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle theme</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
