import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseDetail from './pages/student/CourseDetail';
import QuizPage from './pages/student/QuizPage';
import Certificates from './pages/student/Certificates';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import CreateCourse from './pages/faculty/CreateCourse';
import AddLecture from './pages/faculty/AddLecture';
import AddQuiz from './pages/faculty/AddQuiz';
import AddAssignment from './pages/faculty/AddAssignment';
import ViewSubmissions from './pages/faculty/ViewSubmissions';
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
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/add-lecture/:courseId" element={<AddLecture />} />
        <Route path="/add-quiz/:courseId" element={<AddQuiz />} />
        <Route path="/add-assignment/:courseId" element={<AddAssignment />} />
        <Route path="/submissions/:courseId" element={<ViewSubmissions />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;