var debug = require('debug')('oa:api/user/recovery');
var 调用数据库 = require('../../modules/Db').exec
var 动态验证码 = require('authenticator')
var 回调函数是一个反人类的东西 = require('sync_back').run
module.exports = function (req, res, api, post) {
  var 请求体 = req.body
  var 失败返回 = api.back4Fail
  var 成功返回 = api.back4Success
  回调函数是一个反人类的东西(function* (回调值) {
    if(!请求体.用户名 || 请求体.用户名=='') return 失败返回(400, 0, '用户名未填写。')
    if(!请求体.恢复密钥 || 请求体.恢复密钥=='') return 失败返回(400, 0, '恢复密钥未填写。')
    var SQL语句 = 'SELECT * FROM user WHERE 用户名 = "'+请求体.用户名+'"'
    var 数据库结果 = yield 调用数据库(SQL语句,回调值.next) 
    var 用户
    if(!数据库结果[0]) return 失败返回(400, 1, '用户名不存在。')
    if(数据库结果[0].帐户状态 != 0) return 失败返回(400, 2, '帐户不在恢复状态')
    else 用户 = 数据库结果[0]
    SQL语句 = 'SELECT * FROM user_recovery WHERE id = '+用户.id+' AND 密钥 = "'+请求体.恢复密钥+'"'
    var 数据库结果 = yield 调用数据库(SQL语句,回调值.next)
    if(!数据库结果[0]) return 失败返回(401, 1, '恢复密钥错误，或帐户不在恢复状态。')
    var 动态码密钥 = 动态验证码.generateKey()
    SQL语句 = 'UPDATE user SET 密钥 = "'+动态码密钥+'" WHERE id = '+用户.id
    yield 调用数据库(SQL语句,回调值.next)
    return 成功返回({
      二维码: 动态验证码.generateTotpUri(动态码密钥, (用户.姓).concat(用户.名),'企业 OA 系统', 'SHA1', 6, 30)
    })
  })
}