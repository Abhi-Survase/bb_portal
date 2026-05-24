import React, { useState } from "react";
import { Link } from "react-router";
import {
  Pencil,
  Search,
  ArrowLeft,
  ArrowRight,
  ArrowLeftToLine,
  ArrowRightToLine,
  LayoutDashboard,
  Users,
  UserPlus,
  TrendingDown,
  Bell,
  GraduationCap,
  FileText,
  Settings,
  ChevronRight,
  TrendingUp,
  MoreHorizontal,
  List,
  Edit,
  Moon,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ArrowLeftIcon } from "lucide-react";
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

function ShowUsersPage() {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchClick = () => {
    console.log("Entered value:", searchValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 bg-background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-4">
          <SidebarTrigger />
          User
        </h1>
        <div className="flex items-center gap-4">
          <Button className="px-1" variant="secondary">
            <UserPlus size={16} />
            Add User
          </Button>
          <div className="relative hidden sm:block group w-full max-w-sm">
            <Input
              type="text"
              placeholder="Search User"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10"
            />
            <Button
              type="button"
              variant="muted_outline"
              size="icon"
              onClick={handleSearchClick}
              className="absolute right-0 top-0 h-full w-10 rounded-l-none"
            >
              <Search
                size={16}
                className="text-muted-foreground group-hover:text-foreground transition-colors"
              />
            </Button>
          </div>
          <ModeToggle />
          <UserAvatar />
        </div>
      </header>
      <div className="h-screen flex items-center justify-center">
        <h2>Users Page</h2>
      </div>
    </div>
  );
}

export default ShowUsersPage;
