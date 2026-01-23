import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ArrowLeftIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

function PageNotFound() {
  return (
    <div className="h-screen flex flex-col gap-1 justify-center items-center">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          404 Page Not Found
        </h2>
      </div>
    </div>
  );
}

export default PageNotFound;
