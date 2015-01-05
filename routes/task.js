exports.findByTaskId = function (req, res, next) {
  var task_id = req.params.task_id;
  req.models.Task.findById(
    task_id,
    function (error, task) {
      if (error) return next(error);
      if (!task)
        return res.status(404).end();
      req.task = task;
      next();
  });
}

exports.getTask = function (req, res, next) {
  var task = req.task;
  res.json({ task: task });
}

exports.findByUser = function (req, res, next) {
  var userId = req.params.task_id;
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
  var task = req.task;
  req.models.Worklog.findByTaskId(
    task.id,
    function (error, worklogs) {
      if (error) return next(error);
      if (!worklogs || !worklogs.length)
        return res.status(404).end();
      res.json({ worklogs: worklogs });
  });
}

exports.getWorklog = function (req, res, next) {
  var task = req.task,
      worklogId = req.params.worklog_id;
  req.models.Worklog.findByIdAndTaskId(
    {
      id: worklogId,
      taskId: task.id
    },
    function (error, worklog) {
      if (error) return next(error);
      if (!worklog)
        return res.status(404).end();
      res.json({ worklog: worklog })
  });
}

exports.addWorklog = function (req, res, next) {
  var worklog = req.body.worklog,
      task = req.task;
  if (!worklog) return res.status(400).json({ error: "No worklog payload" });

  worklog.task = task.id;
  worklog.user = task.user;

  req.models.Worklog.create(
    worklog,
    function (error, worklogResponse) {
      if (error) return next(error);
      var worklog = new req.models.Worklog(worklogResponse);
      task.worklogs.push(worklogResponse.id)
      task.save(function (error, taskResponse) {
        if (error) return next(error);
        res.json({
          response: {
            message: "Worklog successfully added.",
            data: worklog
          }
        });
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
