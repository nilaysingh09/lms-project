const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  markLectureComplete,
  getCourseProgress
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, enrollInCourse);
router.get('/my', protect, getMyEnrollments);
router.put('/:courseId/lecture/:lectureId', protect, markLectureComplete);
router.get('/:courseId/progress', protect, getCourseProgress);

module.exports = router;