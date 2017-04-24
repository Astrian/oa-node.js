var express = require('express');
var router = express.Router();
var debug = require('debug')('oa: api');
var util = require('util')
var Db = require('./modules/Db')
var sync = require('sync_back').run
var interface = {}
interface.project = {} 
interface.project.newtemplate = require('./api/project/newtemplate')
interface.project.publishtemplate = require('./api/project/publishtemplate')
  /*            *
   * 用户登录    */
router.post('/login', function (req, res, next) {
    var post = req.body
    run(req, res, {
      'login': false
    }, function (api) {
      var back4Fail = api.back4Fail
      var back4Success = api.back4Success
      req.session.user = 0
      return back4Success(null)
    })
  })
  /*            *
   * 新建专案模板 */
router.post('/project/newtemplate', function (req, res, next) {
    var post = req.body
    run(req, res, {}, function (api) {
      interface.project.newtemplate(req, res, api, post)
    })
  })
  /*            *
   * 发布专案模板 */
router.post('/project/publishtemplate', function (req, res, next) {
  var post = req.body
  run(req, res, {}, function (api) {
    interface.project.publishtemplate(req,res,api,post)
  })
})

function run(req, res, opt, fun) {
  sync(function* (api) {
    var needLogin = opt.login != null ? opt.login : true
    var needDb = opt.db != null ? opt.db : true
    if (needLogin && req.session.user == null) return failBack(401, 0, "未登录至系统。")
    var api = {}
    if (needDb) api.dbExec = function (sql, back) {
      Db.exec(sql, back)
    }
    api.back4Success = successBack
    api.back4Fail = failBack
    fun(api)

    function successBack(data) {
      var json = {}
      json.status = 'Success'
      if (data != null) json.data = data
      res.writeHead(200, {
        'Content-Type': 'application/json;charset=utf-8'
      });
      res.end(JSON.stringify(json));
    }

    function failBack(httpCode, code, des) {
      var json = {}
      json.status = 'Fail'
      json.code = code
      json.description = des
      res.writeHead(httpCode, {
        'Content-Type': 'application/json;charset=utf-8'
      });
      res.end(JSON.stringify(json));
    }
  })
}
module.exports = router; 