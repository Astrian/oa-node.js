var 调用数据库 = require('../../modules/Db').exec
var 随机数生成器 = require('crypto-random-string')
var 回调函数是一个反人类的东西 = require('sync_back').run
module.exports = function (req, res, api, post) {
  var 请求体 = req.body
  var 失败返回 = api.back4Fail
  var 成功返回 = api.back4Success
  回调函数是一个反人类的东西(function* (回调值) {
    var SQL语句 = 'SELECT 所属部门 FROM user WHERE id = ' + req.session.user
    var 数据库结果 = yield 调用数据库(SQL语句, 回调值.next)
    SQL语句 = 'SELECT 是人事部 FROM node WHERE id = '+数据库结果[0].所属部门
    数据库结果 = yield 调用数据库(SQL语句, 回调值.next)
    if(数据库结果[0].是人事部 != 1) return 失败返回(401, 1, "非人事部门，无权使用该接口。")
    if(!请求体.用户名 || 请求体.用户名 == '') return 失败返回(400, 0, "未填写用户名。")
    if(!请求体.邮箱 || 请求体.邮箱 == '') return 失败返回(400, 0, "未填写邮箱。")
    if(!请求体.姓 || 请求体.姓 == '') return 失败返回(400, 0, "未填写姓（First name）。")
    if(!请求体.名 || 请求体.名 == '') return 失败返回(400, 0, "未填写名（Last name）。")
    if(!请求体.所属部门 || 请求体.所属部门 == '') return 失败返回(400, 0, "未填写所属部门。")
    SQL语句 = 'SELECT * FROM user WHERE 用户名 = "'+请求体.用户名+'"'
    数据库结果 = yield 调用数据库(SQL语句, 回调值.next)
    if(数据库结果[0]) return 失败返回(400, 1, "用户名已被占用。")
    SQL语句 = 'SELECT * FROM node WHERE id = "'+请求体.所属部门+'"'
    if(!数据库结果[0]) return 失败返回(400, 2, "所属部门不存在。")
    SQL语句 = 'INSERT INTO user (用户名, 邮箱, 姓, 名, 所属部门, 帐户状态) VALUES ("'+请求体.用户名+'", "'+请求体.邮箱+'","'+请求体.姓+'","'+请求体.名+'","'+请求体.所属部门+'", 1)'
    数据库结果 = yield 调用数据库(SQL语句, 回调值.next)
    var 临时登录密钥 = 随机数生成器(16)
    SQL语句 = 'INSERT INTO user_recovery (id, 密钥) VALUES ("'+数据库结果.insertId+'", "'+临时登录密钥+'")'
    yield 调用数据库(SQL语句, 回调值.next)
    return 成功返回({
      临时登录密钥: 临时登录密钥
    })
  })
}