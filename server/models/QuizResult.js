const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{ type: Number }],
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  passed: { type: Boolean, default: false },
  attemptedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);