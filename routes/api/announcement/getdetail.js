var debug = require('debug')('oa:api/announcement/send');
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西(function* (回调) {
    var 成功返回 = api.back4Success
    var 失败返回 = api.back4Fail
    var 登录用户 = req.session.user
    if (!请求体.id || 请求体.id == '') return 失败返回(401, 0, '没有给出公告 ID。')
    var SQL语句 = 'SELECT * FROM announcements WHERE id = ' + 请求体.id
    var 请求结果 = (yield 调用数据库(SQL语句, 回调.next))[0]
    if (!请求结果) return 失败返回(404, 0, '请求的公告不存在，或当前用户无权查看。')
    if (请求结果.可见范围 != -1) {
      SQL语句 = 'SELECT 所属部门 FROM user WHERE id = ' + 登录用户
      var 所属部门 = (yield 调用数据库(SQL语句, 回调.next))[0].所属部门
      if (所属部门 != 请求结果.可见范围) return 失败返回(404, 0, '请求的公告不存在，或当前用户无权查看。')
    }
    var 已读清单 = JSON.parse(请求结果.已读清单)
    var 当前用户已读 = false
    for (var i in 已读清单) {
      if (已读清单[i].用户 == 登录用户) 当前用户已读 = true
      SQL语句 = 'SELECT 姓, 名, 头像 FROM user WHERE id = ' + 已读清单[i].用户
      已读清单[i] = (yield 调用数据库(SQL语句, 回调.next))[0]
      已读清单[i].时间 = JSON.parse(请求结果.已读清单)[i].时间
    }
    if (!当前用户已读) {
      SQL语句 = "UPDATE announcements SET 已读清单  = '" + JSON.stringify([{
        用户: 登录用户,
        时间: new Date().getTime()
      }].concat(JSON.parse(请求结果.已读清单))) + "' WHERE id = " + 请求结果.id
      yield 调用数据库(SQL语句, 回调.next)
      SQL语句 = 'SELECT 姓, 名, 头像 FROM user WHERE id = ' + 登录用户
      已读清单 = [(yield 调用数据库(SQL语句, 回调.next))[0]].concat(已读清单)
      已读清单[0].时间 = new Date().getTime()
      debug(已读清单[0])
    }
    SQL语句 = 'SELECT 姓, 名, 头像 FROM user WHERE id = ' + 请求结果.发布者
    var 发布者 = (yield 调用数据库(SQL语句, 回调.next))[0]
    请求结果.发布者 = 发布者
    请求结果.已读清单 = 已读清单
    成功返回(请求结果)
  })
}