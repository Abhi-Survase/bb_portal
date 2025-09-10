import bookLogo from "/smp_icon.svg";
import { Button } from "@/components/ui/button";
import "./App.css";
import { Link } from "react-router";

function App() {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center">
      <div>
        <img src={bookLogo} className="logo react" alt="SMP logo" />
      </div>
      <h1>School Management App</h1>
      <div className="card mt-6 grid gap-4">
        <Button variant="outline">
          <Link to="students">Show Student List</Link>
        </Button>
        <Button variant="outline">
          <Link to="students/findStudent">Find Student</Link>
        </Button>
        <Button variant="outline">
          <Link to="addStudent">Add Student Admission</Link>
        </Button>
      </div>
    </div>
  );
}

export default App;
