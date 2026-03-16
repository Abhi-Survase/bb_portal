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

function SchoolCalendar() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 --background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold --foreground flex items-center gap-4">
          <SidebarTrigger />
          School Calendar
        </h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-medium text-sm">
            BP
          </div>
        </div>
      </header>
      <div className="h-screen flex items-center justify-center">
        <h2>School Calendar</h2>
      </div>
    </div>
  );
}

export default SchoolCalendar;
