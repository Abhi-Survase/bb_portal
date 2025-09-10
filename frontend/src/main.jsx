import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import AllStudentPage from "./pages/AllStudentPage.jsx";
import AddStudentPage from "./pages/AddStudentPage.jsx";
import GetStudentPage from "./pages/GetStudentPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="students">
          <Route index element={<AllStudentPage />} />
          <Route path="findStudent" element={<GetStudentPage />} />
        </Route>
        <Route path="addStudent" element={<AddStudentPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
