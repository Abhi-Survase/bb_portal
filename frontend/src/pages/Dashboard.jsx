import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Search,
  Bell,
  GraduationCap,
  FileText,
  Settings,
  ChevronRight,
  TrendingUp,
  MoreHorizontal,
  Calendar,
  List,
  Edit,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function Dashboard() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-4">
          <SidebarTrigger />
          Dashboard Overview
        </h1>

        <div className="flex items-center gap-4">
          {/* Global Search Bar (Replaces 'Find Student' Page) */}
          <div className="relative hidden sm:block group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600"
              size={16}
            />
            <input
              type="text"
              placeholder="Search students, IDs..."
              className="pl-10 pr-4 py-2 w-64 bg-slate-100 border-transparent focus:bg-white border focus:border-rose-500 rounded-full text-sm focus:outline-none transition-all"
            />
          </div>

          <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-medium text-sm">
            AD
          </div>
        </div>
      </header>
    </div>
  );
}

export default Dashboard;
