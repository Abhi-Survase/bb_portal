import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ArrowLeftIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";

function AddUserPage(fetchedUserData) {
  function handleUpdatePageOpen() {
    console.log(fetchedUserData);
  }
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-4">
          <SidebarTrigger />
          Add User
        </h1>
      </header>
      <Toaster />
      <div className="h-screen flex items-center justify-center">
        <h2>Add User Page</h2>
      </div>
    </div>
  );
}

export default AddUserPage;
