import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

function CreateCourse() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', level: 'beginner'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/courses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Course created successfully!');
      navigate('/faculty-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <h2>Create New Course</h2>
        <p className="subtitle">Fill in the details below</p>

        <div className="form-card">
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>Course Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Web Development Basics"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              placeholder="What will students learn?"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
            />

            <label>Category</label>
            <input
              type="text"
              name="category"
              placeholder="e.g. Web Development"
              value={formData.category}
              onChange={handleChange}
              required
            />

            <label>Level</label>
            <select name="level" value={formData.level} onChange={handleChange}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/faculty-dashboard')}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;