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
  }
}

module.exports = mongoose.model('TimeLog', timeLogSchema);
