import bookLogo from "/smp_icon.svg";
import { Button } from "@/components/ui/button";
import "./App.css";
import { Link } from "react-router";
import { BookOpen, Search, Plus, Edit, List } from "lucide-react";
import { Navigate, BrowserRouter, Routes, Route } from "react-router";
import AllStudentPage from "./pages/AllStudentPage.jsx";
import AddStudentPage from "./pages/AddStudentPage.jsx";
import GetStudentPage from "./pages/FindStudentPage.jsx";
import UpdateStudentPage from "./pages/UpdateStudentPage.jsx";
import Dashboard_new from "./pages/Dashboard_dummy.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Layout_with_sidebar from "./components/layout_with_sidebar.jsx";

function App() {
  // console.log(import.meta.env.VITE_DASHBOARD_URL);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout_with_sidebar />}>
          <Route path="/">
            <Route
              index
              element={
                <Navigate to={import.meta.env.VITE_DASHBOARD_URL} replace />
              }
            />
            <Route
              path={import.meta.env.VITE_DASHBOARD_URL}
              element={<Dashboard />}
            />
          </Route>
          <Route path={import.meta.env.VITE_ALL_STUDENT_URL}>
            <Route index element={<AllStudentPage />} />
            <Route
              path={import.meta.env.VITE_FIND_STUDENT_URL}
              element={<GetStudentPage />}
            />
            <Route
              path={import.meta.env.VITE_ADD_STUDENT_URL}
              element={<AddStudentPage />}
            />
            <Route
              path={import.meta.env.VITE_UPDATE_STUDENT_URL}
              element={<UpdateStudentPage />}
            />
          </Route>
        </Route>
        <Route path="dashboard_new" element={<Dashboard_new />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
