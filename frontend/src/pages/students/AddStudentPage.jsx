import { Link } from "react-router";
import { Search, List } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserAvatar from "../../components/user-avatar";
import { StudentForm } from "../../components/student-form";

function AddStudentPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 bg-background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-4">
          <SidebarTrigger />
          Add Student Admission
        </h1>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <Link to={`/${import.meta.env.VITE_ALL_STUDENT_URL}`}>
              <Button variant="muted_outline">
                <List size={16} />
                All Students
              </Button>
            </Link>
            <Link
              to={`/${import.meta.env.VITE_ALL_STUDENT_URL}/${
                import.meta.env.VITE_FIND_STUDENT_URL
              }`}
            >
              <Button variant="muted_outline">
                <Search size={16} />
                Search Students
              </Button>
            </Link>
          </div>
          <ModeToggle />
          <UserAvatar />
        </div>
      </header>
      <Toaster />
      <div className="space-y-6 p-4 max-w-5xl">
        <StudentForm mode="add" apiUrl={import.meta.env.VITE_ADD_STUDENT_API} />
      </div>
    </div>
  );
}

export default AddStudentPage;
