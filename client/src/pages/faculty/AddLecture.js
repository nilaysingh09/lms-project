import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

function AddLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    title: '', videoUrl: '', duration: '', section: 'General', order: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await API.post(`/lectures/${courseId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Lecture added successfully!');
      setFormData({ title: '', videoUrl: '', duration: '', section: 'General', order: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding lecture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <h2>Add Lecture</h2>
        <p className="subtitle">Add a new video lecture to your course</p>

        <div className="form-card">
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <label>Lecture Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Introduction to HTML"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <label>Video URL</label>
            <input
              type="text"
              name="videoUrl"
              placeholder="e.g. https://youtube.com/watch?v=..."
              value={formData.videoUrl}
              onChange={handleChange}
              required
            />

            <label>Duration</label>
            <input
              type="text"
              name="duration"
              placeholder="e.g. 12:30"
              value={formData.duration}
              onChange={handleChange}
            />

            <label>Section</label>
            <input
              type="text"
              name="section"
              placeholder="e.g. Getting Started"
              value={formData.section}
              onChange={handleChange}
            />

            <label>Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="1"
            />

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/faculty-dashboard')}
              >
                Back
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Lecture'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddLecture;