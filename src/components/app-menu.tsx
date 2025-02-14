import { useAuth } from "@/state/auth";

import { Check, Command } from "lucide-react";
import useAppState from "@/state/app";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/design-system/menubar";
import { Avatar, AvatarFallback } from "@/design-system/avatar";

export function AppMenu() {
  const { user, logout } = useAuth();
  const theme = useAppState((state) => state.theme);
  const setTheme = useAppState((state) => state.setTheme);

  if (!user) return null;

  return (
    <Menubar className="h-12 justify-between px-4 rounded-none">
      <MenubarMenu>
        <div className="flex gap-1">
          <Command />
          <p className="font-semibold">Swimlane</p>
        </div>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger id="app-header-profile-pic-button">
          <Avatar className="size-8">
            <AvatarFallback className="bg-foreground text-background text-sm">
              {user.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarGroup className="py-2">
            <MenubarLabel className="text-xs">Account</MenubarLabel>
            <MenubarItem className="flex items-center gap-4 px-2">
              <Avatar className="size-8">
                <AvatarFallback className="bg-foreground text-background text-sm">
                  {user.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p id="app-header-profile-name">{user.email}</p>
              </div>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Theme</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem
                className="flex justify-between"
                onClick={() => setTheme("light")}
              >
                Light
                {theme === "light" && <Check className="size-4" />}
              </MenubarItem>
              <MenubarItem
                className="flex justify-between"
                onClick={() => setTheme("dark")}
              >
                Dark
                {theme === "dark" && <Check className="size-4" />}
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem id="app-header-logout-button" onClick={logout}>
            Log out
            <MenubarShortcut>⇧⌘Q</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
