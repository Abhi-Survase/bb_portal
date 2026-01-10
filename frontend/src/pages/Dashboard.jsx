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
import { Input } from "@/components/ui/input";

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
            <Link
              to={`/${import.meta.env.VITE_ALL_STUDENT_URL}/${
                import.meta.env.VITE_FIND_STUDENT_URL
              }`}
              className="!text-slate-600"
            >
              <Button variant="outline" className="!text-slate-600">
                <Search size={16} />
                Search Students
              </Button>
            </Link>
          </div>

          <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-medium text-sm">
            BP
          </div>
        </div>
      </header>
    </div>
  );
}

export default Dashboard;
