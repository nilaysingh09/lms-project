import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

function AddAssignment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    title: '', description: '', dueDate: '', totalMarks: 100
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
      await API.post('/assignments', { ...formData, courseId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Assignment created successfully!');
      setFormData({ title: '', description: '', dueDate: '', totalMarks: 100 });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <h2>Add Assignment</h2>
        <p className="subtitle">Create a new assignment for your students</p>

        <div className="form-card">
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <label>Assignment Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Build a Basic HTML Page"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <label>Description / Instructions</label>
            <textarea
              name="description"
              placeholder="Describe what students need to do..."
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
            />

            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />

            <label>Total Marks</label>
            <input
              type="number"
              name="totalMarks"
              value={formData.totalMarks}
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
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAssignment;