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
    <div className="h-screen flex flex-col gap-1 justify-center items-center">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Update Student Admission
        </h2>
      </div>
    </div>
  );
}

export default UpdateStudentPage;
