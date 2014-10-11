exports.list = function (req, res, next) {
  req.models.Task.list(function (error, tasks) {
    if (error) return error;
    res.send({ tasks: tasks }).end();
  });
}

exports.findByUser = function (req, res, next) {
  var userId = req.params.userId;
  req.models.Task.findByUserId(
    userId,
    function (error, tasks) {
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
