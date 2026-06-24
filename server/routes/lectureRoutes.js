const express = require('express');
const router = express.Router();
const {
  addLecture,
  getLecturesByCourse,
  updateLecture,
  deleteLecture
} = require('../controllers/lectureController');
const { protect } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

router.post('/:courseId', protect, roleMiddleware('faculty', 'admin'), addLecture);
router.get('/:courseId', getLecturesByCourse);
router.put('/:id', protect, roleMiddleware('faculty', 'admin'), updateLecture);
router.delete('/:id', protect, roleMiddleware('faculty', 'admin'), deleteLecture);

module.exports = router;