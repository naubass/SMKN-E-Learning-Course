import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout'; // <-- Pastikan ini diimport
import ProtectedRoute from './components/ProtectedRoute';
import StaffRoute from './components/StaffRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageCourses from './components/dashboard/ManageCourses';
import ManageUsers from './components/dashboard/ManageUsers';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonPage from './pages/LessonPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Halaman tanpa navbar (auth) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Halaman dengan navbar utama */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />

        {/* Wajib login untuk akses materi lesson */}
        <Route
          path="/lessons/:lessonId"
          element={
            <ProtectedRoute>
              <LessonPage />
            </ProtectedRoute>
          }
        />

        {/* ========================================== */}
        {/* GROUP DASHBOARD (Otomatis Ada Sidebar Tunggal) */}
        {/* ========================================== */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/dashboard/courses"
            element={
              <StaffRoute>
                <ManageCourses />
              </StaffRoute>
            }
          />

          <Route
            path="/dashboard/users"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />
        </Route>
        {/* ========================================== */}

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;