var mongoose = require('mongoose');

var timeLogSchema = mongoose.Schema({
  name: {
    type: String
  },
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  stopedAt: {
    type: Date,
    required: false
  },
  task: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'}
});

module.exports = mongoose.model('TimeLog', timeLogSchema);
