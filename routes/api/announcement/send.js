var debug = require('debug')('oa:api/announcement/send');
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, 请求体) {回调函数是一个反人类的东西(function*(回调){
  var 成功返回 = api.back4Success
  var 失败返回 = api.back4Fail
  var 登录用户 = req.session.user
  if(!请求体.范围 || 请求体.范围 == '') return 失败返回(400, 0, '没有指定范围')
  if(!请求体.标题 || 请求体.标题 == '') return 失败返回(400, 0, '没有填写公告标题')
  if(!请求体.正文 || 请求体.正文 == '') return 失败返回(400, 0, '没有填写正文')
  var SQL语句
  SQL语句 = 'SELECT 所属部门 FROM user WHERE id = '+登录用户
  debug(SQL语句)
  var 调用结果 = yield 调用数据库(SQL语句, 回调.next)
  debug(调用结果)
  SQL语句 = 'SELECT * FROM node WHERE id = '+ 调用结果[0].所属部门
  调用结果 = yield 调用数据库(SQL语句, 回调.next)
  var 人事部 = false
  var 部门经理 = false
  var 所在部门
  if(调用结果[0].部门经理ID == 登录用户) {
    部门经理 = true
    所在部门 = 调用结果[0].id
  }
  if(调用结果[0].是人事部) 人事部 = true
  switch(请求体.范围){
    case 1:
      if(!部门经理) return 失败返回(401, 1, "当前用户不是部门经理，无法发布部门公告。")
      SQL语句 = 'INSERT INTO announcements (可见范围, 标题, 正文, 发布者, 发布时间) VALUES ('+所在部门+', "'+请求体.标题+'", "'+请求体.正文+'", '+登录用户+', '+new Date().getTime()+')'
      var 新公告 = yield 调用数据库(SQL语句, 回调.next)
      SQL语句 = 'SELECT id FROM user WHERE 所属部门 = '+所在部门
      var 通知接收者 = yield 调用数据库(SQL语句, 回调.next)
      发送通知(通知接收者, 新公告.insertId, 请求体.标题)
      break
    case 2:
      if(!部门经理) return 失败返回(401, 1, "当前用户不是人事部人员，无法发布公司内部公告。")
      SQL语句 = 'INSERT INTO announcements (可见范围, 标题, 正文, 发布者, 发布时间, 已读清单) VALUES (-1, "'+请求体.标题+'", "'+请求体.正文+'", '+登录用户+', '+new Date().getTime()+', "[]")'
      var 新公告 = yield 调用数据库(SQL语句, 回调.next)
      SQL语句 = 'SELECT id FROM user'
      var 通知接收者 = yield 调用数据库(SQL语句, 回调.next)
      发送通知(通知接收者, 新公告.insertId, 请求体.标题)
      break;
    default:
      return 失败返回(400, 1, "范围填写数据异常")
  }
  成功返回(空)
})}

function 发送通知(通知接收者, 公告id, 公告标题){回调函数是一个反人类的东西(function*(回调){
  var SQL语句
  for(var i in 通知接收者){
    SQL语句 = 'INSERT INTO notification (接收者, 连接至, 类型, 内容, 已读, 发送时间) VALUES (' + 通知接收者[i].id + ', ' + 公告id + ', "公告", "收到一个新的公告：'+公告标题+'", false, '+new Date().getTime()+')'
    yield 调用数据库(SQL语句, 回调.next)
  }
})}