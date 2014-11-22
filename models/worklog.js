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
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

workLogSchema.static({
  findById: function (id, callback) {
    this.findOne({
      _id: id
    })
      .select('-task -user -__v')
      .exec(callback);
  },

  findByTaskId: function (taskId, callback) {
    this.find({
      task: taskId
    })
      .select('-task -user -__v')
      .exec(callback);
  },

  findByUserId: function (userId, callback) {
    this.find({
      user: userId
    })
      .select('-task -user -__v')
      .exec(callback);
  }
});

module.exports = mongoose.model('WorkLog', workLogSchema);
