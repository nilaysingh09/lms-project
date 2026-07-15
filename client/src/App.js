import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseDetail from './pages/student/CourseDetail';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import CreateCourse from './pages/faculty/CreateCourse';
import AdminDashboard from './pages/admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;