var debug = require('debug')('oa:api/announcement/send');
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, 请求体) {回调函数是一个反人类的东西(function* (回调) {
  var 成功返回 = api.back4Success
  var 当前登录用户 = req.session.user
  var SQL语句 = 'SELECT 所属部门 FROM user WHERE id = '+当前登录用户
  var 用户所属部门 = ((yield 调用数据库(SQL语句, 回调.next))[0]).所属部门
  SQL语句 = 'SELECT id, 标题, 发布者, 发布时间 FROM announcements WHERE 可见范围 = -1 OR 可见范围 = '+用户所属部门
  var 列表 = yield 调用数据库(SQL语句, 回调.next)
  for (var i in 列表){
    SQL语句 = 'SELECT 姓, 名, 头像 FROM user WHERE id = '+列表[i].发布者
    列表[i].发布者 = (yield 调用数据库(SQL语句, 回调.next))[0]
  }
  成功返回(列表)
})}