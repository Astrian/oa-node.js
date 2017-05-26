var debug = require('debug')('oa: api/project/getprojectdetail');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
module.exports = function (req, res, api, reqBody) {cleanCallback(function* (callback) {
  var return4Success = api.back4Success
  var return4Fail = api.back4Fail
  if(!reqBody.id || reqBody.id =='') return return4Fail(400,0,'未填写模板 ID。')
  var loginUID = req.session.user
  var SQLStatement = 'SELECT * FROM project_temple WHERE id = '+reqBody.id
  var result = yield dbOps(SQLStatement, callback.next)
  if(!result[0]) return return4Fail(404,0,'模板不存在，或当前用户无权查看该模板信息。')
  result = result[0]
  if(result.status != 1){
    SQLStatement = 'SELECT node,status FROM user WHERE id = '+loginUID
    var loginUserInfo = (yield dbOps(SQLStatement, callback.next))[0]
    SQLStatement = 'SELECT ispersonnel FROM node WHERE id = '+loginUserInfo.node
    var isPersonnel = (yield dbOps(SQLStatement, callback.next))[0].ispersonnel
    if(!isPersonnel && loginUserInfo.status!=2) return callback4Fail(404,0,'模板不存在，或当前用户无权查看该模板信息。')
  }
  SQLStatement = 'SELECT judge, flow FROM bind WHERE template = '+result.id
  result.flow = (yield dbOps(SQLStatement, callback.next))
  for(var i in result.flow){
    result.flow[i].judge = JSON.parse(result.flow[i].judge)
    SQLStatement = 'SELECT * FROM flow WHERE id = '+result.flow[i].flow
    debug(SQLStatement)
    result.flow[i].flow = (yield dbOps(SQLStatement, callback.next))[0]
    result.flow[i].flow.flow = JSON.parse(result.flow[i].flow.flow)
    for (var j in result.flow[i].flow.flow){
      if(result.flow[i].flow.flow[j] != -1 && result.flow[i].flow.flow[j] != -2){
        SQLStatement = 'SELECT firstname, lastname, node, avatar FROM user WHERE id = '+result.flow[i].flow.flow[j]
        result.flow[i].flow.flow[j] = (yield dbOps(SQLStatement, callback.next))[0]
        SQLStatement = 'SELECT name FROM node WHERE id = '+result.flow[i].flow.flow[j].node
        result.flow[i].flow.flow[j].node = (yield dbOps(SQLStatement, callback.next))[0].name
      }
    }
  }
  result.sheets = JSON.parse(result.sheets)
  return4Success(result)
})}
