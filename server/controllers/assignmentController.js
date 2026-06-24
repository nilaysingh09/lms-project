const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');

// Create assignment (Faculty only)
const createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate, totalMarks } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      course: courseId,
      dueDate,
      totalMarks
    });

    res.status(201).json({ message: 'Assignment created', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all assignments for a course
const getAssignmentsByCourse = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit assignment (Student only)
const submitAssignment = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const { assignmentId } = req.params;

    // Check assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if already submitted
    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: req.user.id
    });
    if (existing) {
      return res.status(400).json({ message: 'Already submitted' });
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user.id,
      fileUrl
    });

    res.status(201).json({ message: 'Assignment submitted successfully', submission });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Grade a submission (Faculty only)
const gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.isGraded = true;
    await submission.save();

    res.status(200).json({ message: 'Submission graded', submission });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all submissions for an assignment (Faculty only)
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      assignment: req.params.assignmentId
    }).populate('student', 'name email');

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get my submission for an assignment (Student)
const getMySubmission = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      assignment: req.params.assignmentId,
      student: req.user.id
    });

    if (!submission) {
      return res.status(404).json({ message: 'No submission found' });
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createAssignment,
  getAssignmentsByCourse,
  submitAssignment,
  gradeSubmission,
  getSubmissions,
  getMySubmission
};