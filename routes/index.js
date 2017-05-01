var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.user == null) res.render('index');
  else res.redirect('/home')
});

router.get('/home', function(req, res, next) {
  if (req.session.user != null) res.render('home');
  else res.redirect('/')
});

router.get('/signout', function(req, res, next) {
  if (req.session.user != null) res.render('signout');
  else res.redirect('/')
});

router.get('/project', function(req, res, next) {
  if (req.session.user != null) res.render('project-index');
  else res.redirect('/')
});

router.get('/project/detail', function(req, res, next) {
  if (req.session.user != null) res.render('project-detail');
  else res.redirect('/')
});

router.get('/project/new', function(req, res, next) {
  if (req.session.user != null) res.render('project-new');
  else res.redirect('/')
});
router.get('/project/template', function(req, res, next) {
  if (req.session.user != null) res.render('template');
  else res.redirect('/')
});

module.exports = router;
