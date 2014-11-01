var mongoose = require('mongoose');

var workLogSchema = mongoose.Schema({
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  timeSpent: {
    type: Number,
    required: true,
    validate: [ function (value) {
      return value > 0;
    }, 'Time spent must be greater than zero.' ]
  },
  task: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'}
});

workLogSchema.static({
  findByTaskId: function (taskId, callback) {
    this.find({
      task: taskId
    })
      .select('-task -__v')
      .sort({ _id: -1 })
      .exec(callback);
  }
});

module.exports = mongoose.model('WorkLog', workLogSchema);
