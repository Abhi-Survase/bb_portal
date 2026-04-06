import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ArrowLeftIcon } from "lucide-react";

function UpdateStudentPage(fetchedUserData) {
  function handleUpdatePageOpen() {
    console.log(fetchedUserData);
  }
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 bg-background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold --foreground flex items-center gap-4">
          <SidebarTrigger />
          Update Student Admission
        </h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-medium text-sm">
            BP
          </div>
        </div>
      </header>
      <div className="h-screen flex items-center justify-center">
        <h2>Update Student Admission Details</h2>
      </div>
    </div>
  );
}

export default UpdateStudentPage;
