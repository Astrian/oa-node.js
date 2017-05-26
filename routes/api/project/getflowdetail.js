var debug = require('debug')('oa: api/project/getprojectdetail');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
module.exports = function (req, res, api, reqBody) {cleanCallback(function* (callback) {
  var return4Success = api.back4Success
  var return4Fail = api.back4Fail
  if(!reqBody.id || reqBody.id =='') return return4Fail(400,0,'未填写模板 ID。')
  var loginUID = req.session.user
  var SQLStatement = 'SELECT * FROM flow WHERE id = '+reqBody.id
  var result = yield dbOps(SQLStatement, callback.next)
  if(!result[0]) return return4Fail(404,0,'流程不存在，或当前用户无权查看该流程信息。')
  result = result[0]
  result.flow = JSON.parse(result.flow)
  for(var i in result.flow){
    if(result.flow[i]!=-1 && result.flow[i] != -2){
      SQLStatement = 'SELECT firstname, lastname, node, avatar FROM user WHERE id = '+result.flow[i]
      result.flow[i] = (yield dbOps(SQLStatement, callback.next))[0]
      SQLStatement = 'SELECT * FROM node WHERE id = '+result.flow[i].node
      result.flow[i].node = (yield dbOps(SQLStatement, callback.next))[0]
    }
  }
  return4Success(result)
})}
