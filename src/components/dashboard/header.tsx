
"use client";

import type { User } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Moon, Sun, User as UserIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { mockUsers } from "@/lib/data";

type HeaderProps = {
  onThemeChange: () => void;
  theme: string;
};

export default function Header({
  onThemeChange,
  theme,
}: HeaderProps) {
  const user = mockUsers.admin;
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6 lg:px-8">
        <SidebarTrigger className="md:hidden" />
        <div className="mr-4 hidden md:flex">
          <a className="flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
              Dashboard
            </span>
          </a>
        </div>

        <div
          className="flex flex-1 items-center justify-between space-x-2 md:justify-end"
          suppressHydrationWarning
        >
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onThemeChange} suppressHydrationWarning>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full" suppressHydrationWarning>
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
