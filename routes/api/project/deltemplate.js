var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
var debug = require('debug')('oa:api/project/submitproject');

module.exports = function (req, res, api, reqBody) {cleanCallback(function*(callback){
  var loginUID = req.session.user
  var return4Success = api.back4Success
  var return4Fail = api.back4Fail
  var SQLStatement = 'SELECT node,status FROM user WHERE id = '+loginUID
  var loginUserInfo = (yield dbOps(SQLStatement, callback.next))[0]
  SQLStatement = 'SELECT ispersonnel FROM node WHERE id = '+loginUserInfo.node
  var isPersonnel = (yield dbOps(SQLStatement, callback.next))[0].ispersonnel
  if(!isPersonnel && loginUserInfo.status!=2) return callback4Fail(401,0,"当前登录用户无权使用本接口。")
  if (!reqBody.template || reqBody.template == '') return callback4Fail(400, 0, "没有定义需要删除或归档的模板。")
  SQLStatement = 'SELECT * FROM project_temple WHERE status = 0 AND status = 1 AND id = '+reqBody.template
  var template = (yield dbOps(SQLStatement, callback.next))[0]
  if(!template){
    return return4Fail(404, 0, '所需操作的模板不存在，或已被归档。')
  }
  if(template.status == 1){
    SQLStatement = 'UPDATE project_temple SET status = -1 WHERE id = '+reqBody.template
    yield dbOps(SQLStatement, callback.next)
  }else if(template.status == 0){
    SQLStatement = 'DELETE FROM project_temple WHERE id = '+reqBody.template
    yield dbOps(SQLStatement, callback.next)
    SQLStatement = 'DELETE FROM bind WHERE template = '+reqBody.template
    yield dbOps(SQLStatement, callback.next)
  }else{
    return return4Fail(500, 0, '专案记录不正常。')
  }
  return4Success(null)
})}
