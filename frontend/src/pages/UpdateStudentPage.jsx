import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function UpdateStudentPage(fetchedUserData) {
  function handleUpdatePageOpen() {
    console.log(fetchedUserData);
  }
  return (
    <div className="h-screen flex flex-col gap-1 justify-center items-center">
      <h2 className="scroll-m-20 text-3xl font-bold tracking-tight text-balance">
        Update Student Info
      </h2>
      <Button onClick={handleUpdatePageOpen}>Update</Button>
      <Button variant="link" asChild>
        <Link to="/">Go Back</Link>
      </Button>
    </div>
  );
}

export default UpdateStudentPage;
