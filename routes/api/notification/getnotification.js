var debug = require('debug')('oa:api/notification/getnotification');
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西(function * (回调){
    var 成功返回 = api.back4Success
    var 登录用户 = req.session.user
    var SQL语句 = 'SELECT * FROM notification WHERE 接收者 = '+登录用户+' ORDER BY 发送时间 DESC'
    var 调用结果 = yield 调用数据库(SQL语句,回调.next)
    var SQL语句 = 'UPDATE notification SET 已读 = true WHERE 接收者 = '+登录用户+' AND 已读 = false'
    yield 调用数据库(SQL语句,回调.next)
    成功返回(调用结果)
  })
}