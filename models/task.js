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
  worklogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkLog'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

taskSchema.static({
  findById: function (id, callback) {
    this.findOne({
      _id: id
    })
      .populate('user', 'username')
      .populate('worklogs', 'id')
      .select('-__v')
      .sort({ _id: -1 })
      .exec(callback);
  },

  findByUserId: function (userId, callback) {
    this.find({
      user: userId
    })
      .populate('user', 'username')
      .populate('worklogs', 'id')
      .select('-__v')
      .sort({ _id: -1 })
      .exec(callback);
  }
});

taskSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Task', taskSchema);
