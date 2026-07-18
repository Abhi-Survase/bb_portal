import {
  LayoutDashboard,
  Users,
  List,
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
  Calendar,
  IdCardLanyard,
} from "lucide-react";
import bookLogo from "/bbp_icon.svg";
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
import { Link, useLocation } from "react-router";

// Menu items.
// `matchPrefix` decides which sidebar item lights up. Any route that starts
// with a given prefix counts as "on that section" - so /students/add,
// /students/find, and any future /students/... route all highlight the
// item(s) sharing the /students prefix, while Teachers and Users stay
// independent since they're separate resources, not sub-pages of one another.
const studentsBaseUrl = `/${import.meta.env.VITE_ALL_STUDENT_URL}`;

const sidebar_menu_items = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: `/${import.meta.env.VITE_DASHBOARD_URL}`,
    matchPrefix: `/${import.meta.env.VITE_DASHBOARD_URL}`,
  },
  {
    title: "Students",
    icon: List,
    url: `/${import.meta.env.VITE_ALL_STUDENT_URL}/${
      import.meta.env.VITE_FIND_STUDENT_URL
    }`,
    matchPrefix: studentsBaseUrl,
  },
  {
    title: "Teachers",
    icon: IdCardLanyard,
    url: `/${import.meta.env.VITE_ADMIN_URL}/${import.meta.env.VITE_TEACHERS_URL}`,
    matchPrefix: `/${import.meta.env.VITE_ADMIN_URL}/${import.meta.env.VITE_TEACHERS_URL}`,
  },
  {
    title: "Users",
    icon: Users,
    url: `/${import.meta.env.VITE_ADMIN_URL}/${import.meta.env.VITE_USERS_URL}`,
    matchPrefix: `/${import.meta.env.VITE_ADMIN_URL}/${import.meta.env.VITE_USERS_URL}`,
  },
];

// True if the current path is this item's own route, or a nested route
// underneath it (e.g. "/students" matches "/students/add/step-2").
function isSectionActive(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function AppSidebar() {
  const location = useLocation();
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 pt-5 !pb-2 pl-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0">
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
            <SidebarMenu className="pl-3 group-data-[collapsible=icon]:pl-2 ">
              {sidebar_menu_items.map((item) => (
                <SidebarMenuItem
                  className="py-[0.2rem] w-full"
                  key={item.title}
                >
                  <SidebarMenuButton
                    asChild
                    className="w-full"
                    isActive={isSectionActive(
                      location.pathname,
                      item.matchPrefix,
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>
                        <p className="text-[0.9rem]">{item.title}</p>
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="pl-2 pb-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="gap-3 px-4 py-5 w-full"
              isActive={isSectionActive(location.pathname, "/school/calendar")}
            >
              <Link to="/school/calendar">
                <Calendar />
                <span>Calendar</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              asChild
              className="gap-3 px-4 py-5 w-full"
              isActive={location.pathname === "settings"}
            >
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
