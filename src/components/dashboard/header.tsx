"use client";

import type { User } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Moon, Search, Sun, User as UserIcon, Users } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

type HeaderProps = {
  user: User;
  onRoleChange: (role: "admin" | "member") => void;
  onThemeChange: () => void;
  theme: string;
  onSearch: (term: string) => void;
};

export default function Header({
  user,
  onRoleChange,
  onThemeChange,
  theme,
  onSearch,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
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
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search components..."
                className="w-full bg-background pl-9 md:w-[200px] lg:w-[320px]"
                onChange={(e) => onSearch(e.target.value)}
                suppressHydrationWarning
              />
            </div>
          </div>
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
                
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={user.role} onValueChange={(value) => onRoleChange(value as "admin" | "member")}>
                  <DropdownMenuLabel>Role</DropdownMenuLabel>
                  <DropdownMenuRadioItem value="member">
                    <Users className="mr-2 h-4 w-4" />
                    Member
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="admin">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Admin
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
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
