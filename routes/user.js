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

      req.models.Task.findByUserId(
        user._id,
        function (error, tasks) {
          if (error) return next(error);
          if (!tasks || !tasks.length)
            return res.status(404).end();
          res.json({ tasks: tasks });
      });
  });
}

exports.add = function (req, res, next) {
  var user = req.body.user;
  if (!user) return res.status(400).json({ error: "No user payload" });
  req.models.User.create(user, function (error, userResponse) {
    if (error) return next(error);
    res.json({ response: {
      message: "User successfully added.",
      data: userResponse
    }});
  });
}

exports.authenticate = function (req, res, next) {
  // TODO
}
