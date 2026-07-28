import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

function AddQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(15);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '', options: ['', '', '', ''], correctAnswer: 0
    }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await API.post('/quizzes', {
        title, courseId, questions, timeLimit, maxAttempts
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Quiz created successfully!');
      setTitle('');
      setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <h2>Add Quiz</h2>
        <p className="subtitle">Create a quiz for your students</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-card" style={{ marginBottom: '16px' }}>
            <label>Quiz Title</label>
            <input
              type="text"
              placeholder="e.g. HTML Basics Quiz"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label>Time Limit (minutes)</label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={e => setTimeLimit(Number(e.target.value))}
                  min="1"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Max Attempts</label>
                <input
                  type="number"
                  value={maxAttempts}
                  onChange={e => setMaxAttempts(Number(e.target.value))}
                  min="1"
                />
              </div>
            </div>
          </div>

          {questions.map((q, qIndex) => (
            <div className="form-card" key={qIndex} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>Question {qIndex + 1}</h4>
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '4px 12px', fontSize: '12px' }}
                    onClick={() => removeQuestion(qIndex)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <label>Question</label>
              <input
                type="text"
                placeholder="Enter your question"
                value={q.question}
                onChange={e => updateQuestion(qIndex, 'question', e.target.value)}
                required
              />

              <label>Options</label>
              {q.options.map((option, oIndex) => (
                <div key={oIndex} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctAnswer === oIndex}
                    onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <input
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                    value={option}
                    onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                    required
                    style={{ flex: 1 }}
                  />
                  {q.correctAnswer === oIndex && (
                    <span style={{ color: '#059669', fontSize: '12px', fontWeight: '600' }}>Correct</span>
                  )}
                </div>
              ))}
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                Select the radio button next to the correct answer
              </p>
            </div>
          ))}

          <button
            type="button"
            className="btn-secondary"
            onClick={addQuestion}
            style={{ marginBottom: '16px' }}
          >
            + Add Another Question
          </button>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/faculty-dashboard')}
            >
              Back
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : `Create Quiz (${questions.length} questions)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddQuiz;