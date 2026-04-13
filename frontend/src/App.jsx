import "./App.css";
import { Navigate, BrowserRouter, Routes, Route } from "react-router";
import {
  AllStudentPage,
  AddStudentPage,
  FindStudentPage,
  UpdateStudentPage,
  Dashboard,
  ShowUsersPage,
  AddUserPage,
  ShowTeachersPage,
  AddTeacherPage,
  PageNotFound,
  SchoolCalendar,
  LoginPage,
} from "./pages";
import Layout_with_sidebar from "./components/layout_with_sidebar.jsx";

function App() {
  // console.log(import.meta.env.VITE_DASHBOARD_URL);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={<Navigate to={import.meta.env.VITE_LOGIN_URL} replace />}
          />
          <Route
            path={import.meta.env.VITE_LOGIN_URL}
            element={<LoginPage />}
          />
        </Route>
        <Route element={<Layout_with_sidebar />}>
          <Route
            path={import.meta.env.VITE_DASHBOARD_URL}
            element={<Dashboard />}
          />
          <Route path={import.meta.env.VITE_ALL_STUDENT_URL}>
            <Route index element={<AllStudentPage />} />
            <Route
              path={import.meta.env.VITE_FIND_STUDENT_URL}
              element={<FindStudentPage />}
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
          <Route path={import.meta.env.VITE_ADMIN_URL}>
            <Route path="calendar" element={<SchoolCalendar />} />
            <Route path={import.meta.env.VITE_TEACHERS_URL}>
              <Route index element={<ShowTeachersPage />} />
              <Route
                path={import.meta.env.VITE_ADD_TEACHER_URL}
                element={<AddTeacherPage />}
              />
            </Route>
            <Route path={import.meta.env.VITE_USERS_URL}>
              <Route index element={<ShowUsersPage />} />
              <Route
                path={import.meta.env.VITE_ADDUSER_URL}
                element={<AddUserPage />}
              />
            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
