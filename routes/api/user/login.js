var debug = require('debug')('oa:api/user/recovery');
var 调用数据库 = require('../../modules/Db').exec
var 动态验证码 = require('authenticator')
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, post) {
  var 请求体 = req.body
  回调函数是一个反人类的东西(function* (back) {
    var 失败返回 = api.back4Fail
    var 成功返回 = api.back4Success
    if(!请求体.用户名 || 请求体.用户名 =='') return 失败返回(400, 0, '用户名未填写')
    if(!请求体.验证码 || 请求体.验证码 =='') return 失败返回(400, 0, '验证码未填写')
    var SQL语句 = 'SELECT 密钥, id, 帐户状态 FROM user WHERE 用户名 = "' + 请求体.用户名 + '"'
    var 查询结果 = yield 调用数据库(SQL语句, back.next)
    if (!查询结果[0]) return 失败返回(400, 1, '用户不存在')
    if (查询结果[0].帐户状态 != 1 && 查询结果[0].帐户状态 != 2) return 失败返回(400, 2, '帐户状态不正常')
    var 密钥 = 查询结果[0].密钥
    var 验证结果 = 动态验证码.verifyToken(密钥, 请求体.验证码)
    /*验证结果 = {
        delta: 0
      } // 调试用*/
    if (验证结果) {
      if (验证结果.delta == 0) {
        req.session.user = 查询结果[0].id
        return 成功返回(空)
      }
      else return 失败返回(500, 0, '未知的服务器错误。')
    }
    else return 失败返回(401, 0, '动态验证码不正确，或已过期。')
  })
}