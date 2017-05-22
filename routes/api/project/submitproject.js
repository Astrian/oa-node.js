var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
var debug = require('debug')('oa:api/project/submitproject');

module.exports = function (req, res, api, reqBody) {cleanCallback(function*(callback){
  var loginUID = req.session.user
  var return4Success = api.back4Success
  var return4Fail = api.back4Fail
  SQLStatement = 'SELECT node, firstname, lastname FROM user WHERE id = '+loginUID
  var user = (yield dbOps(SQLStatement, callback.next))[0]
  if(!reqBody.project || reqBody.project == '') return return4Fail(400, 0, "未填写专案 ID。")
  var SQLStatement = 'SELECT * FROM project WHERE id = '+reqBody.project+' AND applyer = '+loginUID
  var result = (yield dbOps(SQLStatement, callback.next))[0]
  if (!result) return return4Fail(404,0, "专案不存在，或当前登录用户无权提交当前专案。")
  if(result.status != -1) return return4Fail(400,1, "相应专案已被删除、归档，或已在审核状态（非草稿状态）。")
  var project = result
  project.data = JSON.parse(project.data)
  SQLStatement = 'SELECT * FROM project_temple WHERE id = '+project.template
  var template = (yield dbOps(SQLStatement, callback.next))[0]
  SQLStatement = 'SELECT * FROM bind WHERE template = '+project.template
  var bindflows = yield dbOps(SQLStatement, callback.next)
  var flow = -1
  for(var i in bindflows){
    bindflows[i].judge = JSON.parse(bindflows[i].judge)
    if(bindflows[i].judge == 'other') flow = i
    if(flow == -1){
      if(bindflows[i].judge.field == 'priority'){
        if(project.priority = bindflows[i].judge.value) flow = i
      }else{
        switch(bindflows[i].judge.condition){
          case '<': if(project.data[bindflows[i].judge.field] < bindflows[i].judge.value) flow = i; break;
          case '>': if(project.data[bindflows[i].judge.field] > bindflows[i].judge.value) flow = i; break;
          case '<=': if(project.data[bindflows[i].judge.field] <= bindflows[i].judge.value) flow = i; break;
          case '>=': if(project.data[bindflows[i].judge.field] >= bindflows[i].judge.value) flow = i; break;
          case '=': if(project.data[bindflows[i].judge.field] == bindflows[i].judge.value) flow = i; break;
        }
      }
    }
  }
  if(flow == -1) return return4Fail(400,2, "因填写错误，相应专案无法进入任何流程。")
  SQLStatement = 'SELECT * FROM flow WHERE id = ' + bindflows[flow].flow
  flow = (yield dbOps(SQLStatement, callback.next))[0]
  var processer
  flow.flow = JSON.parse(flow.flow)
  if(flow.flow[0] == -1){
    SQLStatement = 'SELECT * FROM node WHERE id = '+user.node
    processer = (yield dbOps(SQLStatement, callback.next))[0].manager
  }
  else{
    processer = flow.flow[0];
  }
  var projectStatus
  if(flow.status == 0) projectStatus = -2
  else if(flow.status == 1) projectStatus = 0
  else return return4Fail(400, 3, "符合条件的流程状态不正确。")
  SQLStatement = 'UPDATE project SET whoisprocessing = '+processer+', status = '+projectStatus+', flow = '+flow.id+' WHERE id = '+reqBody.project
  yield dbOps(SQLStatement, callback.next)
  SQLStatement = 'INSERT INTO project_log (user, time, project, operation, flow, flowstep) VALUES ('+loginUID+', '+new Date().getTime()+', '+reqBody.project+', "将专案提交至流程中", '+flow.id+', -1)'
  yield dbOps(SQLStatement, callback.next)
  SQLStatement = 'INSERT INTO notification (reciver, linkto, type, content, `read`, time) VALUES ('+processer+', '+reqBody.project+', "project", "由 '+user.firstname+user.lastname+' 提交的专案正等待审核。", 0, '+new Date().getTime()+')'
  yield dbOps(SQLStatement, callback.next)
  return4Success({
    status: projectStatus,
    flow: flow.id
  })
})}
