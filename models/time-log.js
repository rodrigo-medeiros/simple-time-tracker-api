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
  task: {type: mongoose.Schema.ObjectId, ref: 'Task'}
});

timeLogSchema.static({
  find: function (taskId, callback) {
    this.findOne({ name: 'Blah'})
      .populate('task').exec(callback);
  }
});

module.exports = mongoose.model('TimeLog', timeLogSchema);
