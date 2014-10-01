exports.list = function (req, res, next) {
  req.models.Task.list(function (error, tasks) {
    if (error) return error;
    res.send({ tasks: tasks }).end();
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
