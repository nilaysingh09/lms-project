const Lecture = require('../models/Lecture');
const Course = require('../models/Course');

// Add a lecture to a course (Faculty only)
const addLecture = async (req, res) => {
  try {
    const { title, videoUrl, duration, section, order } = req.body;
    const { courseId } = req.params;

    // Check course exists and belongs to this faculty
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const lecture = await Lecture.create({
      title,
      videoUrl,
      duration,
      section,
      order,
      course: courseId
    });

    res.status(201).json({ message: 'Lecture added successfully', lecture });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all lectures for a course
const getLecturesByCourse = async (req, res) => {
  try {
    const lectures = await Lecture.find({ course: req.params.courseId })
      .sort({ order: 1 });

    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a lecture
const updateLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate('course');

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    if (lecture.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Lecture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ message: 'Lecture updated', lecture: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a lecture
const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate('course');

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    if (lecture.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await lecture.deleteOne();
    res.status(200).json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addLecture, getLecturesByCourse, updateLecture, deleteLecture };