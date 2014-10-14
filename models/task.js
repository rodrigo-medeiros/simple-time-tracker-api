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
  worklogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'WorkLog'}],
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

taskSchema.static({
  list: function (callback) {
    this.find({})
      .populate(['worklogs', 'user'])
      .exec(callback);
  },

  findById: function (id, callback) {
    this.findById(id)
      .populate('worklogs')
      .populate('user', '-password')
      .exec(callback);
  },

  findByUserId: function (userId, callback) {
    this.find({
      user: userId
    },
    null,
    {
      sort: { _id: -1 }
    })
      .populate('worklogs')
      .populate('user', '-password')
      .exec(callback);
  }
});

module.exports = mongoose.model('Task', taskSchema);
