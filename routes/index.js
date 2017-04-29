var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user == null) res.render('index');
  else res.redirect('/home')
});

router.get('/home', function(req, res, next) {
  if (req.session.user != null) res.render('home');
  else res.redirect('/')
});

module.exports = router;
