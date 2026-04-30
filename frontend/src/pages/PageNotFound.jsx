import React from "react";
import { Link } from "react-router";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ArrowLeftIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function PageNotFound() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 bg-background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-4">
          Blossom Book Portal
        </h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </header>
      <div className="h-screen flex flex-col gap-1 justify-center items-center">
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </Button>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">
            404 Page Not Found
          </h2>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
