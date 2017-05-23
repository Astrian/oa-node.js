var debug = require('debug')('oa: api/project/getprojectdetail');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
module.exports = function (req, res, api, reqBody) {cleanCallback(function* (callback) {
  var return4Success = api.back4Success
  var return4Fail = api.back4Fail
  var loginUID = req.session.user
  if(!reqBody.id || reqBody.id == '') return return4Fail(400, 0 ,'专案 ID 未填写。')
  var SQLStatement = 'SELECT * FROM project WHERE id = '+reqBody.id
  var project = (yield dbOps(SQLStatement, callback.next))[0]
  if(!project) return return4Fail(404, 0 ,'专案不存在或无权查看。')
  var rights = []
  SQLStatement = 'SELECT * FROM project_log WHERE project = '+project.id+' AND user = '+loginUID
  var result = (yield dbOps(SQLStatement, callback.next))[0]
  if(!result) rights.push('read')
  if(project.whoisprocessing == loginUID)  rights.push('processer')
  if(project.applyer == loginUID) rights.push('submitter')
  if(rights.length == 0) return return4Fail(404, 0 ,'专案不存在或无权查看。')
  project.data = JSON.parse(project.data)
  SQLStatement = 'SELECT * FROM project_temple WHERE id = '+project.template
  var template = (yield dbOps(SQLStatement, callback.next))[0]
  template.sheets = JSON.parse(template.sheets)
  for(var i in project.data){
    project.data[i] = {
      title: template.sheets[i].title,
      data: project.data[i]
    }
  }
  if(project.flow){
    SQLStatement = 'SELECT * FROM flow WHERE id = '+project.flow
    project.flow = (yield dbOps(SQLStatement, callback.next))[0]
    project.flow.flow = JSON.parse(project.flow.flow)

    for(var i in project.flow.flow){
      debug(project.flow.flow[i])
      switch (project.flow.flow[i]){
        case -1:
        case -2:
          break;
        default:
          SQLStatement = 'SELECT firstname, lastname, avatar, node FROM user WHERE id = '+project.flow.flow[i]
          project.flow.flow[i] = (yield dbOps(SQLStatement, callback.next))[0]
          SQLStatement = 'SELECT * FROM node where id = '+project.flow.flow[i].node
          project.flow.flow[i].node = (yield dbOps(SQLStatement, callback.next))[0].name
      }
    }
  }
  if(project.whoisprocessing){
    SQLStatement = 'SELECT firstname, lastname, avatar, node FROM user WHERE id = '+project.whoisprocessing
    project.whoisprocessing = (yield dbOps(SQLStatement, callback.next))[0]
    SQLStatement = 'SELECT * FROM node where id = '+project.whoisprocessing.node
    project.whoisprocessing.node = (yield dbOps(SQLStatement, callback.next))[0].name
  }
  project.rights = rights
  SQLStatement = 'SELECT * FROM project_log WHERE project = '+project.id
  project.history = yield dbOps(SQLStatement, callback.next)
  for(var i in project.history){
    SQLStatement = 'SELECT firstname, lastname, avatar, node FROM user WHERE id = '+project.history[i].user
    project.history[i].user = (yield dbOps(SQLStatement, callback.next))[0]
    SQLStatement = 'SELECT * FROM node where id = '+project.history[i].user.node
    project.history[i].user.node = (yield dbOps(SQLStatement, callback.next))[0].name
  }
  SQLStatement = 'SELECT firstname, lastname, avatar FROM user WHERE id = '+project.applyer
  project.applyer = (yield dbOps(SQLStatement, callback.next))[0]
  SQLStatement = 'SELECT * FROM project_temple WHERE id = '+project.template
  project.template = (yield dbOps(SQLStatement, callback.next))[0]
  project.template.sheets = JSON.parse(project.template.sheets)
  return4Success(project)
})}
