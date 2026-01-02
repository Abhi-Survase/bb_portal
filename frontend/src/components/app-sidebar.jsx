import {
  LayoutDashboard,
  Users,
  UserPlus,
  Search,
  Bell,
  BookOpen,
  GraduationCap,
  FileText,
  Settings,
  ChevronRight,
  TrendingUp,
  MoreHorizontal,
  BriefcaseBusiness,
  Edit,
} from "lucide-react";
import bookLogo from "/smp_icon.svg";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link } from "react-router";

// Menu items.
const sidebar_menu_items = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: import.meta.env.VITE_DASHBOARD_URL,
  },
  {
    title: "Student Directory",
    icon: Users,
    // url: import.meta.env.VITE_ALL_STUDENT_URL,
    url: `${import.meta.env.VITE_ALL_STUDENT_URL}/${
      import.meta.env.VITE_FIND_STUDENT_URL
    }`,
  },
  {
    title: "Add Admission",
    icon: UserPlus,
    url: `/${import.meta.env.VITE_ALL_STUDENT_URL}/${
      import.meta.env.VITE_ADD_STUDENT_URL
    }`,
  },
  {
    title: "Update Info",
    icon: Edit,
    url: `/${import.meta.env.VITE_ALL_STUDENT_URL}/${
      import.meta.env.VITE_UPDATE_STUDENT_URL
    }`,
  },
  {
    title: "Teachers",
    icon: BriefcaseBusiness,
    url: import.meta.env.VITE_TEACHERS_URL,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-3 py-2 group-data-[collapsible=icon]:justify-center">
          {/* Logo container */}
          <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary/50 text-sidebar-primary-foreground">
            <img src={bookLogo} alt="Blossom Portal" className="h-6 w-6" />
          </div>

          {/* Text – hidden when collapsed */}
          <div className="flex flex-col gap-0.25 leading-none group-data-[collapsible=icon]:hidden">
            <span className="truncate text-[1.2rem] font-bold tracking-tight">
              Blossom Book
            </span>
            <span className="truncate font-semibold text-sm text-sidebar-foreground/70">
              Admission Portal
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebar_menu_items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="gap-3">
              <Link to="settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
