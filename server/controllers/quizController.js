const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Course = require('../models/Course');

// Create a quiz (Faculty only)
const createQuiz = async (req, res) => {
  try {
    const { title, courseId, questions, timeLimit, maxAttempts } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const quiz = await Quiz.create({
      title,
      course: courseId,
      questions,
      timeLimit,
      maxAttempts
    });

    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all quizzes for a course
const getQuizzesByCourse = async (req, res) => {
  try {
    // Remove correctAnswer before sending to frontend
    const quizzes = await Quiz.find({ course: req.params.courseId })
      .select('-questions.correctAnswer');

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit a quiz attempt (Student only)
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check attempt limit
    const attemptCount = await QuizResult.countDocuments({
      quiz: quizId,
      student: req.user.id
    });

    if (attemptCount >= quiz.maxAttempts) {
      return res.status(400).json({
        message: `Maximum ${quiz.maxAttempts} attempt(s) allowed`
      });
    }

    // Grade on server side
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });

    const total = quiz.questions.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 60;

    const result = await QuizResult.create({
      quiz: quizId,
      student: req.user.id,
      answers,
      score,
      total,
      percentage,
      passed
    });

    res.status(201).json({
      message: passed ? 'Quiz passed!' : 'Quiz failed. Better luck next time!',
      result
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get my quiz results
const getMyResults = async (req, res) => {
  try {
    const results = await QuizResult.find({
      student: req.user.id,
      quiz: req.params.quizId
    }).populate('quiz', 'title');

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single quiz by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .select('-questions.correctAnswer');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createQuiz, getQuizzesByCourse, submitQuiz, getMyResults, getQuizById };