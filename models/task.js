var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'New task',
    validate: [ function (value) {
      return value.length <= 30;
    }, 'Task name is too long.']
  },
  description: {
    type: String,
    required: false,
    validate: [ function (value) {
      return value.length <= 150;
    }, 'Task description is too long.']
  },
  status: {
    type: String,
    required: true,
    default: 'Open',
    validate: [ function (value) {
      return ['Open', 'In Progress', 'Closed'].some(function (item) {
        return item === value;
      });
    }, 'not a valid status' ],
    set: function (value) {
      return value.trim();
    }
  },
  worklogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'TimeLog'}]
});

taskSchema.static({
  list: function (callback) {
    this.find({}).populate('worklogs').exec(callback);
  }
});

module.exports = mongoose.model('Task', taskSchema);
