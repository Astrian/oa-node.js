var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var debug = require('debug')('oa:api/project/reviewproject');
var 空 = null
module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西(function* (回调) {
    var 成功返回 = api.back4Success
    var 失败返回 = api.back4Fail
    var 当前用户 = req.session.user
    if (!请求体.专案ID || 请求体.专案ID == '') return 失败返回(400, 0, '未填写专案 ID。')
    if (!请求体.操作 || 请求体.操作 == '') return 失败返回(400, 0, '未指定操作。')
    if (请求体.操作 != '同意' && 请求体.操作 != '拒绝') return 失败返回(400, 1, '操作不合法。')
    var SQL语句 = 'SELECT 所属部门 FROM user WHERE id = ' + 当前用户
    var 调用结果 = yield 调用数据库(SQL语句, 回调.next)
    var 所属部门 = 调用结果[0].所属部门
    SQL语句 = 'SELECT * FROM project WHERE id = ' + 请求体.专案ID
    调用结果 = yield 调用数据库(SQL语句, 回调.next)
    if (调用结果[0].目前处理的部门 != 所属部门) return 失败返回(401, 0, '当前用户无权操作本专案。')
    if (调用结果[0].状态 != 1) return 失败返回(400, 2, '专案目前不在审核状态。')
    var 专案 = 调用结果[0]
    SQL语句 = 'SELECT * FROM project_temple WHERE id = ' + 专案.模板
    调用结果 = yield 调用数据库(SQL语句, 回调.next)
    var 流程 = JSON.parse(调用结果[0].流程)
    SQL语句 = 'SELECT * FROM user WHERE id = ' + 专案.申请人
    var 提交者 = yield 调用数据库(SQL语句, 回调.next)
    if (请求体.操作 == '同意') {
      if (流程[专案.路由].流程[(专案.进度 + 1)]) {
        SQL语句 = 'SELECT id FROM node WHERE 名称 = "' + 流程[专案.路由].流程[(专案.进度 + 1)] + '"'
        调用结果 = yield 调用数据库(SQL语句, 回调.next)
        SQL语句 = 'UPDATE project SET 进度 = ' + ((专案.进度) + 1) + ', 目前处理的部门 = ' + 调用结果[0].id + ' WHERE id = ' + 专案.id
        yield 调用数据库(SQL语句, 回调.next)
        SQL语句 = 'SELECT * FROM user WHERE 所属部门 = ' + 调用结果[0].id
        var 通知者 = yield 调用数据库(SQL语句, 回调.next)
        for (var i in 通知者) {
          SQL语句 = 'INSERT INTO notification (接收者, 连接至, 类型, 内容, 已读, 发送时间) VALUES (' + 通知者[i].id + ', ' + 专案.id + ', "专案", "由 ' + (提交者[0].姓).concat(提交者[0].名) + ' 提交的专案正等待处理。", false, '+new Date().getTime()+')'
          yield 调用数据库(SQL语句, 回调.next)
        }
        SQL语句 = 'INSERT INTO notification (接收者, 连接至, 类型, 内容, 已读, 发送时间) VALUES (' + 提交者[0].id + ', ' + 专案.id + ', "专案", "您提交的专案已通过 ' + 流程[专案.路由].流程[(专案.进度)] + ' 审核，流程将继续交由 '+流程[专案.路由].流程[(专案.进度 + 1)]+' 处理。", false, '+new Date().getTime()+')'
        yield 调用数据库(SQL语句, 回调.next)
        SQL语句 = 'INSERT INTO notification (接收者, 连接至, 类型, 内容, 已读) VALUES (' + 提交者[0].id + ', ' + 专案.id + ', "专案", "您提交的专案已通过 ' + 流程[专案.路由].流程[(专案.进度)] + ' 审核，正提交下一步审核。", false, '+new Date().getTime()+')'
        yield 调用数据库(SQL语句, 回调.next)
        SQL语句 = 'INSERT INTO project_log (专案ID, 操作人, 行为, 操作时间) VALUES (' + 专案.id + ', ' + 当前用户 + ', "审核并同意该专案。", ' + new Date().getTime() + ')'
        yield 调用数据库(SQL语句, 回调.next)
      }
      else {
        SQL语句 = 'INSERT INTO notification (接收者, 连接至, 类型, 内容, 已读, 发送时间) VALUES (' + 提交者[0].id + ', ' + 专案.id + ', "专案", "您提交的专案已通过 ' + 流程[专案.路由].流程[(专案.进度)] + ' 审核，流程完毕。", false, '+new Date().getTime()+')'
        yield 调用数据库(SQL语句, 回调.next)
        SQL语句 = 'UPDATE project SET 进度 = null, 状态 = -1 WHERE id = ' + 专案.id
        yield 调用数据库(SQL语句, 回调.next)
        SQL语句 = 'INSERT INTO project_log (专案ID, 操作人, 行为, 操作时间) VALUES (' + 专案.id + ', ' + 当前用户 + ', "审核并同意该专案，且专案流程完毕，自动归档。", ' + new Date().getTime() + ')'
        yield 调用数据库(SQL语句, 回调.next)
      }
    }
    else if (请求体.操作 == '拒绝') {
      SQL语句 = 'INSERT INTO notification (接收者, 连接至, 类型, 内容, 已读, 发送时间) VALUES (' + 提交者[0].id + ', ' + 专案.id + ', "专案", "您提交的专案已被 ' + 流程[专案.路由].流程[(专案.进度)] + ' 拒绝，请在修改后重新提交。", false, '+new Date().getTime()+')'
      yield 调用数据库(SQL语句, 回调.next)
      SQL语句 = 'UPDATE project SET 进度 = null, 状态 = 0, 路由 = null, 目前处理的部门 = null WHERE id = ' + 专案.id
      yield 调用数据库(SQL语句, 回调.next)
      SQL语句 = 'INSERT INTO project_log (专案ID, 操作人, 行为, 操作时间) VALUES (' + 专案.id + ', ' + 当前用户 + ', "审核并拒绝该专案。", ' + new Date().getTime() + ')'
      yield 调用数据库(SQL语句, 回调.next)
    }
    成功返回(空)
  })
}