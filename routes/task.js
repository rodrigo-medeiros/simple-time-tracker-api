var async = require('async');

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
};

exports.findByWorklogId = function (req, res, next) {
	var worklog_id = req.params.worklog_id,
			task = req.task;
	req.models.Worklog.findByIdAndTaskId(
		{
			id: worklog_id,
			taskId: task.id
		},
		function (error, worklog) {
			if (error) return next(error);
			if (!worklog)
				return res.status(404).end();
			req.worklog = worklog;
			next();
		});
};

exports.getTask = function (req, res, next) {
  var task = req.task;
  res.json({ task: task });
};

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
};

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
};

exports.edit = function (req, res, next) {
  var task = req.task,
      taskPayload = req.body.task;
  if (!taskPayload) return res.status(400).json({ error: "No task payload." });

  task.set(taskPayload);
  task.save(function (error, taskResponse) {
    if (error) return next(error);
    res.json({
      response: {
        message: "Task successfully updated.",
        data: taskResponse
      }
    });
  });
};

exports.delete = function (req, res, next) {
  async.series({
    deleteWorklogs: function (callback) {
      deleteWorklogs(req, callback);
    },
    deleteTask: function (callback) {
      deleteTask(req, callback);
    }
  }, function (error, results) {
    res.status(204).end();
  });
};

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
};

exports.getWorklog = function (req, res, next) {
	var worklog = req.worklog;
	res.json({ worklog: worklog });
};

exports.addWorklog = function (req, res, next) {
  var worklogPayload = req.body.worklog,
      task = req.task;
  if (!worklogPayload) return res.status(400).json({ error: "No worklog payload." });

  worklogPayload.task = task.id;
  worklogPayload.user = task.user;

  req.models.Worklog.create(
    worklogPayload,
    function (error, worklogResponse) {
      if (error) return next(error);
      task.worklogs.push(worklogResponse.id);
      task.save(function (error, taskResponse) {
        if (error) return next(error);
        res.json({
          response: {
            message: "Worklog successfully added.",
            data: worklogResponse
          }
        });
      });
		}
	);
};

exports.editWorklog = function (req, res, next) {
	var worklog = req.worklog,
			worklogPayload = req.body.worklog;
	if (!worklogPayload) return res.status(400).json({ error: "No worklog payload." });

	worklog.set(worklogPayload);
	worklog.save(function (error, worklogResponse) {
		if (error) return next(error);
		res.json({
			response: {
				message: "Worklog successfully updated.",
				data: worklogResponse
			}
		});
	});
};

exports.deleteWorklog = function (req, res, next) {
	var worklog = req.worklog;

	worklog.remove(function (error, doc) {
		if (error) return next(error);
		res.status(204).end();
	});
};

function deleteWorklogs (req, callback) {
  var task = req.task;

  req.models.Worklog.findByTaskId(
    task.id,
    function (error, worklogs) {
      if (error) return callback(error);

      async.each(worklogs, function (worklog, callback) {
        worklog.remove(callback);
      }, function (error) {
        if (error) return callback(error);
        callback(null, "Worklogs deleted.");
      });
  });
}

function deleteTask (req, callback) {
  var task = req.task;
  task.remove(callback);
}
