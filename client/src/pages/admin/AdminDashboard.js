import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <h2>Admin Panel ⚙️</h2>
        <p className="subtitle">Platform overview</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{courses.length}</h3>
            <p>Total Courses</p>
          </div>
          <div className="stat-card">
            <h3>{courses.filter(c => c.isPublished).length}</h3>
            <p>Published</p>
          </div>
          <div className="stat-card">
            <h3>{courses.reduce((a, c) => a + (c.enrolledStudents?.length || 0), 0)}</h3>
            <p>Total Enrollments</p>
          </div>
        </div>

        <div className="section">
          <h3>All Courses</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Students</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>{course.instructor?.name}</td>
                  <td>{course.category}</td>
                  <td>{course.enrolledStudents?.length || 0}</td>
                  <td>
                    <span className={`status-badge ${course.isPublished ? 'published' : 'draft'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;