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
