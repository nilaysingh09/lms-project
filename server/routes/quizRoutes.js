const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getQuizzesByCourse,
  submitQuiz,
  getMyResults
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

router.post('/', protect, roleMiddleware('faculty', 'admin'), createQuiz);
router.get('/course/:courseId', protect, getQuizzesByCourse);
router.post('/:quizId/submit', protect, roleMiddleware('student'), submitQuiz);
router.get('/:quizId/my-results', protect, getMyResults);

module.exports = router;