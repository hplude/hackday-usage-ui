var express = require('express');
var router = express.Router();
var usage = require('../lib/usage');

router.post('/', function(req, res, next) {
  usage(req.body).then((file) =>{
  	res.sendFile(file[0])
  });
  // res.send('fsdf')
  // .then((file) => {
  	// res.send(file);
  });
  
// });

/* GET users listing. */
router.get('/total-requests', function(req, res, next) {
  res.send('hello ');
});

router.get('/qs-requests', function(req, res, next) {
  res.send('goodbye');
});

module.exports = router;