var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var debug = require('debug')('oa:api/project/submitproject');
var 类型判断 = require('util')
var 空 = null

module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西(function*(回调){
    var 登录用户 = req.session.user
    var 成功返回 = api.back4Success
    var 失败返回 = api.back4Fail
    if(!请求体.专案ID || 请求体.专案ID == '') return 失败返回(400, 0, "未填写专案 ID。")
    var SQL语句 = 'SELECT * FROM project WHERE id = '+请求体.专案ID+' AND 申请人 = '+登录用户
    var 调用结果 = yield 调用数据库(SQL语句, 回调.next)
    if (!调用结果[0]) return 失败返回(404,0, "专案不存在，或当前登录用户无权提交当前专案。")
    if(调用结果[0].状态 != 0) return 失败返回(400,1, "相应专案已被删除、归档，或已在审核状态（非草稿状态）。")
    var 专案 = 调用结果[0]
    SQL语句 = 'SELECT * FROM project_temple WHERE id = ' + 专案.模板
    调用结果 = yield 调用数据库(SQL语句, 回调.next)
    var 流程 = JSON.parse(调用结果[0].流程)
    var 流程路由
    专案.数据 = JSON.parse(专案.数据)
    for (var i in 流程){
      if(!流程路由){
        if((类型判断.isString(流程[i].判断)) && (流程[i].判断 == '其他')) 流程路由 = i;
        if((流程[i].判断.条件 == '<') && (专案.数据[流程[i].判断.字段] < 流程[i].判断.基准值)) 流程路由 = i;
        if((流程[i].判断.条件 == '>') && (专案.数据[流程[i].判断.字段] > 流程[i].判断.基准值)) 流程路由 = i;
        if((流程[i].判断.条件 == '<=') && (专案.数据[流程[i].判断.字段] <= 流程[i].判断.基准值)) 流程路由 = i;
        if((流程[i].判断.条件 == '>=') && (专案.数据[流程[i].判断.字段] > 流程[i].判断.基准值)) 流程路由 = i;
        if((流程[i].判断.条件 == '=') && (专案.数据[流程[i].判断.字段] == 流程[i].判断.基准值)) 流程路由 = i;
      }
    }
    debug(流程路由)
    if(!流程路由)  return 失败返回(400,1, "相应专案无法进入任何流程。")
    SQL语句 = 'UPDATE project SET 进度 = 0, 路由 = '+流程路由+', 状态 = 1 WHERE id = '+专案.id
    debug(SQL语句)
    yield 调用数据库(SQL语句, 回调.next)
    SQL语句 = 'INSERT INTO project_log (专案ID, 操作人, 行为, 操作时间) VALUES ('+专案.id+', '+登录用户+', "提交该专案", '+new Date().getTime()+')'
    yield 调用数据库(SQL语句, 回调.next)
    // 缺通知系统
    成功返回({
      流程路由: 流程[流程路由].流程
    })
  })
}