exports.findById = function (req, res, next) {
  var id = req.params.id;
  req.models.Task.findById(
    id, 
    function (error, task) {
      if (error) return next(error);
      if (!task)
        return res.status(404).end();
      res.json({ task: task });
  });
}

exports.findByUser = function (req, res, next) {
  var userId = req.params.id;
  req.models.Task.findByUserId(
    userId,
    function (error, tasks) {
      if (error) return next(error);
      if (!tasks || !tasks.length)
        return res.status(404).end();
      res.json({ tasks: tasks });
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
