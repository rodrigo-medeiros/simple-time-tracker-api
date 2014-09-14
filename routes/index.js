exports.index = function (req, res, next) {
  console.log('it worked');
  res.json({ 
    foo: 'bar'
  });
};
