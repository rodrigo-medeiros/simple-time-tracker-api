var mongoose = require('mongoose');

var timeLogSchema = mongoose.Schema({
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  stopedAt: {
    type: Date,
    required: false
  },
  total: {
    type: Number,
    required: false,
    default: 0
  }
}

module.exports = mongoose.model('TimeLog', timeLogSchema);
