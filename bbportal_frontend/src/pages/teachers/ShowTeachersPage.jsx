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

function ShowTeachersPage() {
  return (
    <div className="flex-1 flex flex-col min-h-svh">
      <header className="h-16 bg-background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-4">
          <SidebarTrigger />
          Teachers
        </h1>
        <div className="flex items-center gap-4">
          <Link
            to={`/${import.meta.env.VITE_ADMIN_URL}/${import.meta.env.VITE_TEACHERS_URL}/${import.meta.env.VITE_ADD_TEACHER_URL}`}
          >
            <Button className="px-3" variant="teacher">
              <UserPlus size={16} />
              Add Teacher
            </Button>
          </Link>
          <ModeToggle />
          <UserAvatar />
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <h2>Teachers List</h2>
      </div>
    </div>
  );
}

export default ShowTeachersPage;
