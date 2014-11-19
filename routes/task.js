exports.findByName = function (req, res, next) {
  var name = req.params.name;
  req.models.Task.findByName(
    name,
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

exports.getWorklogs = function (req, res, next) {
  var name = req.params.name;
  req.models.Task.findByName(
    name,
    function (error, task) {
      if (error) return next(error);
      if (!task)
        return res.status(404).end();

      req.models.Worklog.findByTaskId(
        task._id,
        function (error, worklogs) {
          if (error) return next(error);
          if (!worklogs || !worklogs.length)
            return res.status(404).end();
          res.json({ worklogs: worklogs });
      });
  });
}

exports.add = function (req, res, next) {
  var task = req.body.task;
  if (!task) return res.status(400).json({ error: "No task payload" });
  req.models.Task.create(task, function (error, taskResponse) {
    if (error) return next(error);
    res.json({
      response: {
        message: "Task successfully added.",
        data: taskResponse
      }
    });
  });
}

exports.edit = function (req, res, next) {
  // TODO
}

exports.del = function (req, res, next) {
  // TODO
}
