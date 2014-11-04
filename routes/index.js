exports.user = require('./user');
exports.task = require('./task');
exports.worklog = require('./worklog');

exports.index = function (req, res, next) {
  req.models.Task.find({}, null, {sort: {id: -1}}, function (error, tasks) {
    if (error) return next(error);
    res.json(JSON.stringify(tasks));
  });
};
