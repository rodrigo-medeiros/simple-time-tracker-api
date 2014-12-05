var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    validate: [ function (value) {
      return value.length <= 30;
    }, 'First name is too long.']
  },
  lastName: {
    type: String,
    required: true,
    validate: [ function (value) {
      return value.length <= 30;
    }, 'Last name is too long.']
  },
  username: {
    type: String,
    required: true,
    validate: [ function (value) {
      return value.length <= 20;
    }, 'Username is too long.']
  },
  email: {
    type: String,
    required: true,
    set: function (value) {
      return value.trim();
    },
    validate: [ function (email) {
      return (email.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i) !== null)
    }, 'Email is empty or not valid.']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  }
});

userSchema.static({
  findByUsername: function (username, callback) {
    this.findOne({
      username: username
    })
      .select('-__v -password')
      .exec(callback);
  },

  findById: function (id, callback) {
    this.findOne({
      _id: id
    })
      .select('-__v -password')
      .exec(callback);
  }
});

userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret._v;
  }
});

module.exports = mongoose.model('User', userSchema);
