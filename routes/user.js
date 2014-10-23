exports.findById = function (req, res, next) {
  var id = req.params.id;
  req.models.User.findById(
    id,
    function (error, user) {
      if (error) return next(error);
      if (!user)
        return res.status(404).end();
      res.json({ user: user });
  });
}

exports.getTasks = function (req, res, next) {
  var id = req.params.id;
  req.models.User.findById(
    id,
    function (error, user) {
      if (error) return next(error);
      if (!user)
        return res.status(404).end();

      req.models.Task.find(
        { user: user._id },
        null,
        { sort: {_id: -1 }},
        function (error, tasks) {
          if (error) return next(error);
          if (!tasks || !tasks.length)
            return res.status(404).end();
          res.json({ tasks: tasks });
      });
  });
}

exports.authenticate = function (req, res, next) {
  // TODO
}
