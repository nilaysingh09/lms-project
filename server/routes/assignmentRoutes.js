const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignmentsByCourse,
  submitAssignment,
  gradeSubmission,
  getSubmissions,
  getMySubmission
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

// Assignment routes
router.post('/', protect, roleMiddleware('faculty', 'admin'), createAssignment);
router.get('/course/:courseId', protect, getAssignmentsByCourse);

// Submission routes
router.post('/:assignmentId/submit', protect, roleMiddleware('student'), submitAssignment);
router.put('/submissions/:submissionId/grade', protect, roleMiddleware('faculty', 'admin'), gradeSubmission);
router.get('/:assignmentId/submissions', protect, roleMiddleware('faculty', 'admin'), getSubmissions);
router.get('/:assignmentId/my-submission', protect, roleMiddleware('student'), getMySubmission);

module.exports = router;