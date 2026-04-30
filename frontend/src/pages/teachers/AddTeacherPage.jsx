import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ArrowLeftIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "../../components/user-avatar";

function AddTeacherPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 bg-background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-4">
          <SidebarTrigger />
          Teachers List
        </h1>
        <div className="flex items-center gap-4">
          {/* Global Search Bar (Replaces 'Find Student' Page) */}
          <div className="relative hidden sm:block group">
            <Link
              to={`/${import.meta.env.VITE_ALL_STUDENT_URL}/${
                import.meta.env.VITE_FIND_STUDENT_URL
              }`}
            >
              <Button variant="muted_outline">
                <Search size={16} />
                Add Teacher
              </Button>
            </Link>
          </div>
          <ModeToggle />
          <UserAvatar />
        </div>
      </header>
      <div className="h-screen flex items-center justify-center">
        <h2>Add Teacher Page</h2>
      </div>
    </div>
  );
}

export default AddTeacherPage;
