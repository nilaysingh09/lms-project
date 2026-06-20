const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');

// Enroll a student in a course
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });
    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId
    });

    // Add student to course's enrolledStudents list
    course.enrolledStudents.push(req.user.id);
    await course.save();

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all courses a student is enrolled in
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course');

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark a lecture as completed + update progress
const markLectureComplete = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Add lecture to completed list if not already there
    if (!enrollment.completedLectures.includes(lectureId)) {
      enrollment.completedLectures.push(lectureId);
    }

    // Calculate progress
    const totalLectures = await Lecture.countDocuments({ course: courseId });
    const completedCount = enrollment.completedLectures.length;
    enrollment.progress = totalLectures > 0
      ? Math.round((completedCount / totalLectures) * 100)
      : 0;

    // Mark completed if 100%
    if (enrollment.progress === 100) {
      enrollment.isCompleted = true;
    }

    await enrollment.save();

    res.status(200).json({ message: 'Progress updated', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get progress for one specific course
const getCourseProgress = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  markLectureComplete,
  getCourseProgress
};