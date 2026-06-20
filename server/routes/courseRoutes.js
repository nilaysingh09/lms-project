const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  publishCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', protect, roleMiddleware('faculty', 'admin'), createCourse);
router.put('/:id', protect, roleMiddleware('faculty', 'admin'), updateCourse);
router.put('/:id/publish', protect, roleMiddleware('faculty', 'admin'), publishCourse);
router.delete('/:id', protect, roleMiddleware('faculty', 'admin'), deleteCourse);

module.exports = router;