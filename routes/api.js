var express = require('express');
var router = express.Router();
var 调试输出 = require('debug')('oa:api');
var util = require('util')
var Db = require('./modules/Db')
var 调用数据库 = require('./modules/Db').exec
var sync = require('sync_back').run
var 动态验证码 = require('authenticator');
var interface = {}
var 空 = null
var 加密 = require('bcrypt');
const 盐范围 = 10;
interface.project = {}
interface.user = {}
interface.project.newtemplate = require('./api/project/newtemplate')
interface.project.publishtemplate = require('./api/project/publishtemplate')
interface.project.newproject = require('./api/project/newproject')
interface.user.newuser = require('./api/user/newuser')
  /*            *
   * 用户登录    */
router.post('/login', function (req, res, next) {
    var POST数据 = req.body
    run(req, res, {
      'login': false
    }, function (api) {
      sync(function* (back) {
        var 失败返回 = api.back4Fail
        var 成功返回 = api.back4Success
        var SQL语句 = 'SELECT 密钥, id FROM user WHERE 用户名 = "' + POST数据.用户名 + '"'
        var 查询结果 = yield 调用数据库(SQL语句, back.next)
        if (!查询结果) {
          return 失败返回(400, 1, '用户不存在')
        }
        var 密钥 = 查询结果[0].密钥
        var 验证结果 = 动态验证码.verifyToken(密钥, POST数据.验证码)
        
        验证结果 = {delta: 0} // 调试用
        
        if (验证结果) {
          if (验证结果.delta == 0) {
            req.session.user = 查询结果[0].id
            return 成功返回(空)
          }
          else {
            调试输出(验证结果)
            return 失败返回(500, 0, '未知的服务器错误。')
          }
        }
        else {
          return 失败返回(401, 0, '动态验证码不正确，或已过期。')
        }
      })
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
      interface.project.publishtemplate(req, res, api, post)
    })
  })
  /*          *
   * 新建专案  */
router.post('/project/newproject', function (req, res, next) {
    var post = req.body
    run(req, res, {}, function (api) {
      interface.project.newproject(req, res, api, post)
    })
  })
  /*         *
   * 新建用户 */
router.post('/user/newuser', function (req, res, next) {
  var post = req.body
  run(req, res, {}, function (api) {
    interface.user.newuser(req, res, api, post)
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
      json.状态 = '成功'
      if (data != null) json.数据 = data
      res.writeHead(200, {
        'Content-Type': 'application/json;charset=utf-8'
      });
      res.end(JSON.stringify(json));
    }

    function failBack(httpCode, code, des) {
      var json = {}
      json.状态 = 'Fail'
      json.错误码 = code
      json.错误描述 = des
      res.writeHead(httpCode, {
        'Content-Type': 'application/json;charset=utf-8'
      });
      res.end(JSON.stringify(json));
    }
  })
}
module.exports = router;