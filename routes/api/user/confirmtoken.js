var debug = require('debug')('oa:api/user/recovery');
var 调用数据库 = require('../../modules/Db').exec
var 动态验证码 = require('authenticator')
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, post) {
  var 请求体 = req.body
  var 失败返回 = api.back4Fail
  var 成功返回 = api.back4Success
  回调函数是一个反人类的东西(function* (回调值) {
    if (!请求体.用户名 || 请求体.用户名 == '') return 失败返回(400, 0, '用户名未填写。')
    if (!请求体.恢复密钥 || 请求体.恢复密钥 == '') return 失败返回(400, 0, '恢复密钥未填写。')
    if (!请求体.动态验证码 || 请求体.动态验证码 == '') return 失败返回(400, 0, '动态验证码未填写。')
    var SQL语句 = 'SELECT * FROM user WHERE 用户名 = "' + 请求体.用户名 + '"'
    var 数据库结果 = yield 调用数据库(SQL语句, 回调值.next)
    var 用户
    if (!数据库结果[0]) return 失败返回(400, 1, '用户名不存在。')
    if(数据库结果[0].帐户状态 != 0) return 失败返回(400, 2, '帐户不在恢复状态')
    用户 = 数据库结果[0]
    SQL语句 = 'SELECT * FROM user_recovery WHERE id = ' + 用户.id + ' AND 密钥 = "' + 请求体.恢复密钥 + '"'
    var 数据库结果 = yield 调用数据库(SQL语句, 回调值.next)
    if (!数据库结果[0]) return 失败返回(401, 1, '恢复密钥错误，或帐户不在恢复状态。')
    var 验证结果 = 动态验证码.verifyToken(用户.密钥, 请求体.动态验证码);
    if (验证结果) {
      if (验证结果.delta == 0) {
        req.session.user = 用户.id
        SQL语句 = 'DELETE FROM user_recovery WHERE id = ' + 用户.id
        yield 调用数据库(SQL语句, 回调值.next)
        SQL语句 = 'UPDATE user SET 帐户状态 = 1 WHERE id = '+用户.id
        yield 调用数据库(SQL语句, 回调值.next)
        return 成功返回(空)
      }
      else return 失败返回(500, 0, '未知的服务器错误。')
    }
    else return 失败返回(400, 2, '动态验证码不正确，或已过期。')
  })
}