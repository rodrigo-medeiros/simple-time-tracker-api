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
  task: {type: mongoose.Schema.ObjectId, ref: 'Task'}
});

module.exports = mongoose.model('TimeLog', timeLogSchema);
