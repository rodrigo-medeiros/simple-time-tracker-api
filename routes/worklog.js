exports.findById = function (req, res, next) {
  var id = req.params.id;
  req.models.Worklog.findById(
    id,
    function (error, worklog) {
      if (error) return next(error);
      if (!worklog)
        return res.status(404).end();
      res.json({ worklog: worklog });
  });
}

exports.add = function (req, res, next) {
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

exports.del = function (req, res, next) {
  var id = req.params.id;
  req.models.Worklog.findById(
    id,
    function (error, worklog) {
      if (error) return next(error);
      if (!worklog) return res.status(404).json({ error: "Worklog not found" });

      worklog.remove(function (error, doc) {
        if (error) return next(error);
        res.status(204).end();
      });
  });
}
