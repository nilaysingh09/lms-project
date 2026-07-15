import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) { handleSubmit(); return; }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
        const res = await API.get(`/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
        });
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
        setTimeLeft(res.data.timeLimit * 60);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

  const handleAnswer = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await API.post(
        `/quizzes/${quizId}/submit`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data.result);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="loading">Loading quiz...</div>;
  if (!quiz) return <div className="loading">Quiz not found</div>;

  if (result) {
    return (
      <div>
        <Navbar />
        <div className="dashboard">
          <div className="quiz-result">
            <div className={`result-icon ${result.passed ? 'passed' : 'failed'}`}>
              {result.passed ? 'PASS' : 'FAIL'}
            </div>
            <h2>{result.passed ? 'Congratulations!' : 'Better luck next time!'}</h2>
            <div className="result-stats">
              <div className="result-stat">
                <h3>{result.score}/{result.total}</h3>
                <p>Score</p>
              </div>
              <div className="result-stat">
                <h3>{result.percentage}%</h3>
                <p>Percentage</p>
              </div>
              <div className="result-stat">
                <h3>{result.passed ? 'Yes' : 'No'}</h3>
                <p>Passed</p>
              </div>
            </div>
            <p className="result-note">Passing score is 60%</p>
            <button
              className="btn-primary"
              onClick={() => navigate(-1)}
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <div className="quiz-header">
          <div>
            <h2>{quiz.title}</h2>
            <p className="subtitle">{quiz.questions.length} questions</p>
          </div>
          <div className={`timer ${timeLeft < 60 ? 'timer-warning' : ''}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="quiz-progress">
          <span>{answers.filter(a => a !== null).length} of {quiz.questions.length} answered</span>
        </div>

        {quiz.questions.map((q, qIndex) => (
          <div className="question-card" key={qIndex}>
            <h4>Q{qIndex + 1}. {q.question}</h4>
            <div className="options">
              {q.options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  className={`option ${answers[qIndex] === oIndex ? 'selected' : ''}`}
                  onClick={() => handleAnswer(qIndex, oIndex)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + oIndex)}
                  </span>
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="quiz-footer">
          <button
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting || answers.includes(null)}
          >
            {submitting ? 'Submitting...' : `Submit Quiz (${answers.filter(a => a !== null).length}/${quiz.questions.length} answered)`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;