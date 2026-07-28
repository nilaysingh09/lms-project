import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

function ViewSubmissions() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  // eslint-disable-next-line
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await API.get(`/assignments/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data);
      for (const assignment of res.data) {
        fetchSubmissions(assignment._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await API.get(`/assignments/${assignmentId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(prev => ({ ...prev, [assignmentId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleGrade = async (submissionId, assignmentId) => {
    const gradeData = grades[submissionId];
    if (!gradeData?.grade) {
      alert('Please enter a grade first');
      return;
    }
    try {
      await API.put(`/assignments/submissions/${submissionId}/grade`, {
        grade: Number(gradeData.grade),
        feedback: gradeData.feedback || ''
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Graded successfully!');
      fetchSubmissions(assignmentId);
    } catch (err) {
      alert('Error grading submission');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <button className="btn-back" onClick={() => navigate('/faculty-dashboard')}>
          Back to Dashboard
        </button>
        <h2>Student Submissions</h2>
        <p className="subtitle">Review and grade student assignments</p>

        {assignments.length === 0 ? (
          <div className="empty-state">No assignments created yet.</div>
        ) : (
          assignments.map(assignment => (
            <div key={assignment._id} className="section">
              <h3>{assignment.title}</h3>
              <p className="course-meta">
                Due: {new Date(assignment.dueDate).toLocaleDateString()} •
                Total Marks: {assignment.totalMarks}
              </p>

              {!submissions[assignment._id] || submissions[assignment._id].length === 0 ? (
                <div className="empty-state" style={{ padding: '20px' }}>
                  No submissions yet
                </div>
              ) : (
                submissions[assignment._id].map(sub => (
                  <div key={sub._id} className="submission-card">
                    <div className="submission-info">
                      <h4>{sub.student?.name}</h4>
                      <p>{sub.student?.email}</p>
                      <a>
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-watch"
                        style={{ display: 'inline-block', marginTop: '8px' }}
                      >
                        View Submission
                      </a>
                    </div>

                    {sub.isGraded ? (
                      <div className="graded-badge">
                        <span>Grade: {sub.grade}/{assignment.totalMarks}</span>
                        <span>Feedback: {sub.feedback}</span>
                      </div>
                    ) : (
                      <div className="grade-form">
                        <input
                          type="number"
                          placeholder="Grade"
                          min="0"
                          max={assignment.totalMarks}
                          onChange={e => setGrades(prev => ({
                            ...prev,
                            [sub._id]: { ...prev[sub._id], grade: e.target.value }
                          }))}
                        />
                        <input
                          type="text"
                          placeholder="Feedback (optional)"
                          onChange={e => setGrades(prev => ({
                            ...prev,
                            [sub._id]: { ...prev[sub._id], feedback: e.target.value }
                          }))}
                        />
                        <button
                          className="btn-primary"
                          onClick={() => handleGrade(sub._id, assignment._id)}
                        >
                          Grade
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewSubmissions;