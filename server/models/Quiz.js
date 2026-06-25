const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  questions: [questionSchema],
  timeLimit: { type: Number, default: 30 },
  maxAttempts: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);