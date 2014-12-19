exports.findByName = function (req, res, next) {
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

exports.getWorklogs = function (req, res, next) {
  var id = req.params.id;
  req.models.Task.findById(
    id,
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

exports.addWorklog = function (req, res, next) {
  var worklog = req.body.worklog;
  if (!worklog) return res.status(400).json({ error: "No worklog payload" });
  req.models.Worklog.create(
    worklog,
    function (error, worklogResponse) {
      if (error) return next(error);
      var worklog = new req.models.Worklog(worklogResponse);
      res.json({
        response: {
          message: "Worklog successfully added.",
          data: worklog
        }
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
