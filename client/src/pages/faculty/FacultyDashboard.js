import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

function FacultyDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || user?.role !== 'faculty') {
      navigate('/login');
      return;
    }
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (courseId) => {
    try {
      await API.put(`/courses/${courseId}/publish`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourses();
    } catch (err) {
      alert('Error toggling publish status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h2>Faculty Dashboard 👨‍🏫</h2>
            <p className="subtitle">Manage your courses and students</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate('/create-course')}
          >
            + Create Course
          </button>
        </div>

        <div className="section">
          <h3>My Courses ({courses.length})</h3>
          {courses.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any courses yet.</p>
              <button
                className="btn-primary"
                onClick={() => navigate('/create-course')}
              >
                Create your first course
              </button>
            </div>
          ) : (
            <div className="card-grid">
              {courses.map(course => (
                <div className="course-card" key={course._id}>
                  <div className="card-header">
                    <h4>{course.title}</h4>
                    <span className={`status-badge ${course.isPublished ? 'published' : 'draft'}`}>
                      {course.isPublished ? '🟢 Published' : '⚪ Draft'}
                    </span>
                  </div>
                  <p>{course.description}</p>
                  <p className="course-meta">
                    {course.category} • {course.level}
                  </p>
                  <p className="course-meta">
                    👥 {course.enrolledStudents?.length || 0} students
                  </p>
                  <div className="card-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => handlePublish(course._id)}
                    >
                      {course.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;