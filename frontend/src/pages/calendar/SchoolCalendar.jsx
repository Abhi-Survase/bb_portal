import React from "react";
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

function SchoolCalendar() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 bg-background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold --foreground flex items-center gap-4">
          <SidebarTrigger />
          School Calendar
        </h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserAvatar />
        </div>
      </header>
      <div className="h-screen flex items-center justify-center">
        <h2>School Calendar</h2>
      </div>
    </div>
  );
}

export default SchoolCalendar;
