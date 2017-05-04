var debug = require('debug')('oa:api/user/getlist');
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, 请求体) {回调函数是一个反人类的东西(function* (回调) {
  var 成功返回 = api.back4Success
  var 失败返回 = api.back4Fail
  var 登录用户 = req.session.user
  var SQL语句 = 'SELECT id, 用户名, 姓, 名, 邮箱, 头像, 所属部门 FROM user'
  var 结果 = yield 调用数据库(SQL语句, 回调.next)
  for(var i in 结果){
    SQL语句 = 'SELECT * FROM node WHERE id = '+结果[i].所属部门
    结果[i].所属部门 = (yield 调用数据库(SQL语句, 回调.next))[0]
  }
  成功返回(结果)
})}