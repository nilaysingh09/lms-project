import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lectures');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchAll();
  // eslint-disable-next-line
  }, []);

  const fetchAll = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [courseRes, lectureRes, assignmentRes, quizRes, progressRes] = await Promise.all([
        API.get(`/courses/${courseId}`),
        API.get(`/lectures/${courseId}`),
        API.get(`/assignments/course/${courseId}`, { headers }),
        API.get(`/quizzes/course/${courseId}`, { headers }),
        API.get(`/enroll/${courseId}/progress`, { headers }).catch(() => null)
      ]);
      setCourse(courseRes.data);
      setLectures(lectureRes.data);
      setAssignments(assignmentRes.data);
      setQuizzes(quizRes.data);
      if (progressRes) setProgress(progressRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (lectureId) => {
    try {
      await API.put(
        `/enroll/${courseId}/lecture/${lectureId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating progress');
    }
  };

  const isLectureCompleted = (lectureId) => {
    return progress?.completedLectures?.includes(lectureId);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!course) return <div className="loading">Course not found</div>;

  const handleGetCertificate = async () => {
    try {
      const res = await API.post(
        `/certificates/generate/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Certificate generated! Go to My Certificates in the navbar to download it.');
    } catch (err) {
      if (err.response?.data?.message === 'Certificate already issued') {
        alert('Certificate already issued! Go to My Certificates in the navbar to download it.');
      } else {
        alert(err.response?.data?.message || 'Error generating certificate');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard">

        <div className="course-detail-header">
          <button className="btn-back" onClick={() => navigate('/student-dashboard')}>
            Back
          </button>
          <h2>{course.title}</h2>
          <p className="subtitle">{course.description}</p>
          <div className="course-meta-row">
            <span>{course.category}</span>
            <span>{course.level}</span>
            <span>{course.instructor?.name}</span>
          </div>

          {progress && (
            <div className="detail-progress">
              <div className="progress-header">
                <span>Your Progress</span>
                <span>{progress.progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress.progress}%` }}
                ></div>
              </div>
              {progress.isCompleted && (
                <div className="completed-banner">
                  Course Completed! 🎉
                  <button
                    className="btn-cert"
                    onClick={handleGetCertificate}
                  >
                    Get Certificate
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="detail-tabs">
          <button
            className={`detail-tab ${activeTab === 'lectures' ? 'active' : ''}`}
            onClick={() => setActiveTab('lectures')}
          >
            Lectures ({lectures.length})
          </button>
          <button
            className={`detail-tab ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments ({assignments.length})
          </button>
          <button
            className={`detail-tab ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            Quizzes ({quizzes.length})
          </button>
        </div>

        {activeTab === 'lectures' && (
          <div className="section">
            {lectures.length === 0 ? (
              <div className="empty-state">No lectures added yet.</div>
            ) : (
              lectures.map((lecture, index) => (
                <div className="lecture-item" key={lecture._id}>
                  <div className="lecture-left">
                    <div className={`lecture-num ${isLectureCompleted(lecture._id) ? 'completed' : ''}`}>
                      {isLectureCompleted(lecture._id) ? 'Done' : index + 1}
                    </div>
                    <div>
                      <h4>{lecture.title}</h4>
                      <p>{lecture.section} - {lecture.duration}</p>
                    </div>
                  </div>
                  <div className="lecture-right">
                    <a
                      href={lecture.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-watch"
                    >
                      ▶ Watch
                    </a>
                    {!isLectureCompleted(lecture._id) && (
                      <button
                        className="btn-mark"
                        onClick={() => handleMarkComplete(lecture._id)}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="section">
            {assignments.length === 0 ? (
              <div className="empty-state">No assignments yet.</div>
            ) : (
              assignments.map(assignment => (
                <div className="assignment-item" key={assignment._id}>
                  <div>
                    <h4>{assignment.title}</h4>
                    <p>{assignment.description}</p>
                    <p className="course-meta">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()} - Total Marks: {assignment.totalMarks}
                    </p>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/submit-assignment/${assignment._id}`)}
                  >
                    Submit
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="section">
            {quizzes.length === 0 ? (
              <div className="empty-state">No quizzes yet.</div>
            ) : (
              quizzes.map(quiz => (
                <div className="assignment-item" key={quiz._id}>
                  <div>
                    <h4>{quiz.title}</h4>
                    <p className="course-meta">
                      {quiz.timeLimit} mins - {quiz.questions?.length} questions - Max attempts: {quiz.maxAttempts}
                    </p>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                  >
                    Start Quiz
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default CourseDetail;