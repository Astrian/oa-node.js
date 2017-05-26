var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.user == null) res.render('index');
  else res.redirect('/home')
});
router.get('/recovery', function(req, res, next) {
  if (req.session.user == null) res.render('index-recovery');
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
router.get('/project/template/detail', function(req, res, next) {
  if (req.session.user != null) res.render('template-detail');
  else res.redirect('/')
});
router.get('/project/template/new', function(req, res, next) {
  if (req.session.user != null) res.render('template-new');
  else res.redirect('/')
});
router.get('/project/flow', function(req, res, next) {
  if (req.session.user != null) res.render('flow');
  else res.redirect('/')
});
router.get('/announcement', function(req, res, next) {
  if (req.session.user != null) res.render('announcement-index');
  else res.redirect('/')
});
router.get('/announcement/detail', function(req, res, next) {
  if (req.session.user != null) res.render('announcement-detail');
  else res.redirect('/')
});
router.get('/announcement/new', function(req, res, next) {
  if (req.session.user != null) res.render('announcement-new');
  else res.redirect('/')
});
router.get('/user', function(req, res, next) {
  if (req.session.user != null) res.render('user-index');
  else res.redirect('/')
});
router.get('/user/new', function(req, res, next) {
  if (req.session.user != null) res.render('user-new');
  else res.redirect('/')
});
router.get('/user/getrecoverycode', function(req, res, next) {
  if (req.session.user != null) res.render('user-getrecoverycode');
  else res.redirect('/')
});
router.get('/node', function(req, res, next) {
  if (req.session.user != null) res.render('node-index');
  else res.redirect('/')
});
router.get('/node/new', function(req, res, next) {
  if (req.session.user != null) res.render('node-new');
  else res.redirect('/')
});
router.get('/project/flow/detail', function(req, res, next) {
  if (req.session.user != null) res.render('flowdetail');
  else res.redirect('/')
});
router.get('/project/flow/new', function(req, res, next) {
  if (req.session.user != null) res.render('flow-new');
  else res.redirect('/')
});
router.get('/project/flow/bind', function(req, res, next) {
  if (req.session.user != null) res.render('bindflow');
  else res.redirect('/')
});
module.exports = router;
