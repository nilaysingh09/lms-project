const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const crypto = require('crypto');

// Generate certificate when course is completed
const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check student has completed the course
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'You are not enrolled in this course' });
    }

    if (!enrollment.isCompleted) {
      return res.status(400).json({
        message: `Course not completed yet. Your progress is ${enrollment.progress}%`
      });
    }

    // Check if certificate already issued
    const existing = await Certificate.findOne({
      student: req.user.id,
      course: courseId
    });

    if (existing) {
      return res.status(200).json({
        message: 'Certificate already issued',
        certificate: existing
      });
    }

    // Generate unique verification code
    const verificationCode = crypto.randomBytes(16).toString('hex').toUpperCase();

    const certificate = await Certificate.create({
      student: req.user.id,
      course: courseId,
      verificationCode
    });

    res.status(201).json({
      message: 'Certificate generated successfully!',
      certificate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all certificates for logged in student
const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user.id })
      .populate('course', 'title')
      .populate('student', 'name email');

    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify a certificate by code (public)
const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      verificationCode: req.params.code
    })
      .populate('course', 'title')
      .populate('student', 'name email');

    if (!certificate) {
      return res.status(404).json({ message: 'Invalid certificate code' });
    }

    res.status(200).json({
      message: 'Certificate is valid!',
      certificate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { generateCertificate, getMyCertificates, verifyCertificate };