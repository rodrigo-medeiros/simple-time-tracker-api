exports.list = function (req, res, next) {
  req.models.Task.list(function (error, tasks) {
    if (error) return next(error);
    res.json(tasks);
  });
}

exports.add = function (req, res, next) {
  // TODO
}

exports.edit = function (req, res, next) {
  // TODO
}

exports.del = function (req, res, next) {
  // TODO
}
