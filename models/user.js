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
  email: {
    type: String,
    required: true,
    set: function (value) {
      return value.trim();
    },
    validate: [ validateEmail, 'Email is empty or not valid.']
  },
  password: String,
  admin: {
    type: Boolean,
    default: false
  }
});

var validateEmail = function(email) {
  return (email.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i) != null);
};

module.exports = mongoose.model('User', userSchema);
