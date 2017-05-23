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
  var project = (yield dbOps(SQLStatement, callback.next))[0]
  if (!project) return return4Fail(404,0, "专案不存在，或当前登录用户无权删除当前专案。")
  if(project.status != -1 || project.status != -4) return return4Fail(400,1, "相应专案已被删除、归档，或已在审核状态（非草稿状态）。")
  switch(project.status){
    case -1:
      SQLStatement = 'DELETE FROM project WHERE id = '+reqBody.project
      yield dbOps(SQLStatement, callback.next)
      break;
    case -4:
      SQLStatement = 'UPDATE project SET status = -3 WHERE id = '+reqBody.project
      yield dbOps(SQLStatement, callback.next)
      break;
  }
  return4Success(null)
})}
