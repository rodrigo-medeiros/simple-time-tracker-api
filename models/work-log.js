var mongoose = require('mongoose');

var workLogSchema = mongoose.Schema({
  name: {
    type: String
  },
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

module.exports = mongoose.model('WorkLog', workLogSchema);
