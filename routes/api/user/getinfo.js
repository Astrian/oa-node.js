var debug = require('debug')('oa:api/user/recovery');
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, post) {
  var 请求体 = req.body
  var 登录用户 = req.session.user
  回调函数是一个反人类的东西(function* (回调) {
    var 失败返回 = api.back4Fail
    var 成功返回 = api.back4Success
    var SQL语句 = 'SELECT 用户名, 姓, 名, 头像, 所属部门, 帐户状态 FROM user WHERE id = '+登录用户
    var 调用结果 = yield 调用数据库(SQL语句, 回调.next)
    var 用户 = 调用结果[0]
    成功返回(用户)
  })
}