import bookLogo from "/smp_icon.svg";
import { Button } from "@/components/ui/button";
import "./App.css";
import { Link } from "react-router";

function App() {
  return (
    <div className="bg-(--background) h-screen flex flex-col justify-center items-center text-center">
      <div>
        <img src={bookLogo} className="logo react" alt="SMP logo" />
      </div>
      <h1 className="text-(--foreground) scroll-m-20 text-center border-b m-8 text-4xl font-bold tracking-tight text-balance">
        The Blossom Book Portal
      </h1>
      <div className="card mt-6 grid gap-4">
        <Button variant="secondary">
          <Link to="students">Show Student List</Link>
        </Button>
        <Button variant="secondary">
          <Link to="students/findStudent">Find Student</Link>
        </Button>
        <Button variant="secondary">
          <Link to="students/addStudent">Add Student Admission</Link>
        </Button>
        <Button variant="secondary">
          <Link to="students/updateStudent">Update Student Info</Link>
        </Button>
      </div>
    </div>
  );
}

export default App;
