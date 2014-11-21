exports.findByUserId = function (req, res, next, user_id) {
  req.models.User.findById(
    user_id,
    function (error, user) {
      if (error) return next(error);
      if (!user) return res.status(404).end();
      req.user = user;
      next();
  });
}

exports.getUser = function (req, res, next) {
  res.json({ user: req.user });
}

exports.getTasks = function (req, res, next) {
  var user = req.user;
  req.models.Task.findByUserId(
    user.id,
    function (error, tasks) {
      if (error) return next(error);
      if (!tasks || !tasks.length)
        return res.status(404).end();
      res.json({ tasks: tasks });
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
