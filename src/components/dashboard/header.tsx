
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
import { LogOut, Moon, Sun, User as UserIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";


type HeaderProps = {
  onThemeChange: () => void;
  theme: string;
  user: User | null;
};

export default function Header({
  onThemeChange,
  theme,
  user
}: HeaderProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({ title: "Error", description: "Failed to log out.", variant: "destructive" });
    }
  }

  const userInitial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U";
  const userAvatar = user?.photoURL || `https://placehold.co/40x40.png?text=${userInitial}`;

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
            { user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full" suppressHydrationWarning>
                    <Avatar>
                      <AvatarImage src={userAvatar} alt={user.displayName || "User"} data-ai-hint="user avatar" />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || "No Name"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href="/account">
                      <DropdownMenuItem>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
