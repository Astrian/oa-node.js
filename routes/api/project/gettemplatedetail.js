var debug = require('debug')('oa: api/project/getprojectdetail');
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, 请求体) {回调函数是一个反人类的东西(function* (回调) {
  var 成功返回 = api.back4Success
  var 失败返回 = api.back4Fail
  if(!请求体.id || 请求体.id =='') return 失败返回(400,0,'未填写模板 ID。')
  var 登录用户 = req.session.user
  var SQL语句 = 'SELECT * FROM project_temple WHERE (状态 = 1 OR 创建者 = '+登录用户+') AND id = '+请求体.id
  var 返回 = yield 调用数据库(SQL语句, 回调.next)
  if(!返回[0]) return 失败返回(404,0,'专案不存在，或不是当前用户创建。')
  返回 = 返回[0]
  返回.表字段 = JSON.parse(返回.表字段)
  返回.流程 = JSON.parse(返回.流程)
  成功返回(返回)
})}