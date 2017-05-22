var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
var debug = require('debug')('oa:api/project/reviewproject');
var moment = require('moment')
module.exports = function (req, res, api, reqBody) {cleanCallback(function* (callback) {
  var time = new Date().getTime()
  var return4Success = api.back4Success
  var return4Fail = api.back4Fail
  var loginUID = req.session.user
  if (!reqBody.project || reqBody.project == '') return return4Fail(400, 0, '未填写专案 ID。')
  if (!reqBody.operation || reqBody.operation == '') return return4Fail(400, 0, '未指定操作。')
  var SQLStatement = 'SELECT * FROM project WHERE status <> -1 AND status <> -2 AND whoisprocessing = '+loginUID+' AND id = '+reqBody.project
  var project = (yield dbOps(SQLStatement, callback.next))[0]
  if(!project) return return4Fail(404, 0, '专案不存在（id 错误），或当前专案不应该由当前登录用户审核。')
  project.data = JSON.parse(project.data)
  SQLStatement = 'SELECT * FROM flow WHERE id = '+project.flow
  var flow = (yield dbOps(SQLStatement, callback.next))[0]
  flow.flow = JSON.parse(flow.flow)
  SQLStatement = 'SELECT node,firstname,lastname FROM user WHERE id = '+loginUID
  var loginUser = (yield dbOps(SQLStatement, callback.next))[0]
  SQLStatement = 'SELECT id, firstname, lastname FROM user WHERE id = '+project.applyer
  var applyer = (yield dbOps(SQLStatement, callback.next))[0]
  SQLStatement = 'SELECT * FROM project_log WHERE project = '+reqBody.project
  var opsHistory = yield dbOps(SQLStatement, callback.next)
  var duration = time - opsHistory[(opsHistory.length)-1].time
  switch(reqBody.operation){
    case 'pass':
      var nextProcesser
      var nextStep
      if(flow.flow[project.status+1] == -2){
        if(!reqBody.next || reqBody.next == '') return return4Fail(409,0,'')
        SQLStatement = 'SELECT node FROM use WHERE id = '+reqBody.next
        var result = (yield dbOps(SQLStatement, callback.next))[0]
        SQLStatement = 'SELECT * FROM node WHERE id = '+result.node
        result =  (yield dbOps(SQLStatement, callback.next))[0]
        if(result.parentnode != user.node) return return4Fail(400, 3, '下一步指定的流程人所在部门不是当前用户所在部门的子部门。')
        nextProcesser = result.id
        nextStep = (project.status)+1
      }else if(!flow.flow[project.status+1]){
        nextProcesser = "NULL"
        nextStep = -3
      }else{
        nextProcesser = flow.flow[(+project.status)+1]
        nextStep = (project.status)+1
      }
      if(nextStep == -3){
        //流程已经结束
      }else{
        SQLStatement = 'UPDATE project SET status = '+nextStep+', whoisprocessing = '+nextProcesser+' WHERE id = '+project.id
        yield dbOps(SQLStatement, callback.next)
        SQLStatement = 'SELECT id, firstname, lastname FROM user where id = '+nextProcesser
        nextProcesser = (yield dbOps(SQLStatement, callback.next))[0]
        SQLStatement = 'INSERT INTO notification (reciver, linkto, type, content, `read`, time) VALUES ('+nextProcesser.id+', '+reqBody.project+', "project", "由 '+applyer.firstname+applyer.lastname+' 提交的专案正等待审核。", 0, '+time+')'
        yield dbOps(SQLStatement, callback.next)
        SQLStatement = 'INSERT INTO notification (reciver, linkto, type, content, `read`, time) VALUES ('+applyer.id+', '+reqBody.project+', "project", "您的专案已通过 '+loginUser.firstname+loginUser.lastname+' 审核，正提交至 '+nextProcesser.firstname+nextProcesser.lastname+' 审核。", 0, '+time+')'
        yield dbOps(SQLStatement, callback.next)
        // 转换为自然时间的时间段描述： debug(moment.duration(duration).humanize())
        SQLStatement = 'INSERT INTO project_log (user, time, project, operation, flow, flowstep, duration) VALUES ('+loginUID+', '+time+', '+reqBody.project+', "审核并同意该专案。", '+flow.id+', '+((nextStep)-1)+','+duration+')'
        yield dbOps(SQLStatement, callback.next)
      }
      break;
    case 'refuse':
      if(!reqBody.note || reqBody.note == '') return return4Fail(400,0,'未填写拒绝理由。')
      SQLStatement = 'INSERT INTO notification (reciver, linkto, type, content, `read`, time) VALUES ('+applyer.id+', '+reqBody.project+', "project", "您的专案被 '+loginUser.firstname+loginUser.lastname+' 审核，并被拒绝。", 0, '+time+')'
      yield dbOps(SQLStatement, callback.next)
      SQLStatement = 'UPDATE project SET status = -1, whoisprocessing = NULL, flow = NULL WHERE id = '+project.id
      yield dbOps(SQLStatement, callback.next)
      SQLStatement = 'INSERT INTO project_log (user, time, project, operation, flow, flowstep, duration) VALUES ('+loginUID+', '+time+', '+reqBody.project+', "审核并拒绝该专案，附加信息：'+reqBody.note+'。", '+flow.id+', '+project.status+','+duration+')'
      yield dbOps(SQLStatement, callback.next)
      break;
    default:
      return return4Fail(400, 1, '操作不合要求。')
  }
  return4Success(null)
})}
