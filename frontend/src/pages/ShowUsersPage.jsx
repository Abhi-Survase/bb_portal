import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ArrowLeftIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

function ShowUsersPage(fetchedUserData) {
  function handleUpdatePageOpen() {
    console.log(fetchedUserData);
  }
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 --background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold --foreground flex items-center gap-4">
          <SidebarTrigger />
          User
        </h1>
      </header>
      <div className="h-screen flex items-center justify-center">
        <h2>Users Page</h2>
      </div>
    </div>
  );
}

export default ShowUsersPage;
