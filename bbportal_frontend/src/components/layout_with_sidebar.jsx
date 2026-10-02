import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";

function Layout_with_sidebar() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <>
          <Outlet />
        </>
      </main>
      <Toaster />
    </SidebarProvider>
  );
}

export default Layout_with_sidebar;
