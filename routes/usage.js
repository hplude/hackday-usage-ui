var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/total-requests', function(req, res, next) {
  res.send('hello ');
});

router.get('/qs-requests', function(req, res, next) {
  res.send('goodbye');
});

module.exports = router;
