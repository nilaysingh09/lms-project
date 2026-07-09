import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

function StudentDashboard() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || user?.role !== 'student') {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollRes, courseRes] = await Promise.all([
        API.get('/enroll/my', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/courses')
      ]);
      setEnrollments(enrollRes.data);
      setCourses(courseRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await API.post('/enroll', { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Enrolled successfully!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error enrolling');
    }
  };

  const isEnrolled = (courseId) => {
    return enrollments.some(e => e.course?._id === courseId);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <h2>Welcome back, {user?.name}! 👋</h2>
        <p className="subtitle">Continue where you left off</p>

        {enrollments.length > 0 && (
          <div className="section">
            <h3>My Courses</h3>
            <div className="card-grid">
              {enrollments.map(e => (
                <div className="course-card" key={e._id}>
                  <h4>{e.course?.title}</h4>
                  <p>{e.course?.category}</p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${e.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{e.progress}% complete</span>
                  {e.isCompleted && (
                    <span className="badge-complete">✅ Completed</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section">
          <h3>Available Courses</h3>
          <div className="card-grid">
            {courses.map(course => (
              <div className="course-card" key={course._id}>
                <h4>{course.title}</h4>
                <p>{course.description}</p>
                <p className="course-meta">
                  {course.category} • {course.level}
                </p>
                <p className="course-meta">
                  👨‍🏫 {course.instructor?.name}
                </p>
                {isEnrolled(course._id) ? (
                  <button className="btn-enrolled" disabled>
                    ✅ Enrolled
                  </button>
                ) : (
                  <button
                    className="btn-enroll"
                    onClick={() => handleEnroll(course._id)}
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;