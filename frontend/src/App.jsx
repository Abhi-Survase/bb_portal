import bookLogo from "/smp_icon.svg";
import { Button } from "@/components/ui/button";
import "./App.css";
import { Link } from "react-router";
import { BookOpen, Search, Plus, Edit, List } from "lucide-react";
import { Navigate, BrowserRouter, Routes, Route } from "react-router";
import AllStudentPage from "./pages/AllStudentPage.jsx";
import AddStudentPage from "./pages/AddStudentPage.jsx";
import GetStudentPage from "./pages/GetStudentPage.jsx";
import UpdateStudentPage from "./pages/UpdateStudentPage.jsx";
import Dashboard_new from "./pages/Dashboard_dummy.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard_new" element={<Dashboard_new />} />
        </Route>
        <Route path="students">
          <Route index element={<AllStudentPage />} />
          <Route path="findStudent" element={<GetStudentPage />} />
        </Route>
        <Route path="admission">
          <Route path="addStudent" element={<AddStudentPage />} />
          <Route path="updateStudent" element={<UpdateStudentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
