var debug = require('debug')('oa:api/project/publishtemplate')
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
module.exports = function (req, res, api, reqBody) {cleanCallback(function* (callback) {
  var return4Fail = api.back4Fail
  var return4Success = api.back4Success
  var loginUID = req.session.user
  var SQLStatement = 'SELECT status, node FROM user WHERE id = '+loginUID
  var userInfo = (yield dbOps(SQLStatement, callback.next))[0]
  SQLStatement = 'SELECT ispersonnel FROM node WHERE id = '+userInfo.node
  userInfo.isPersonnel = (yield dbOps(SQLStatement, callback.next))[0].ispersonnel
  if(userInfo.status != 2 && userInfo.isPersonnel != 1) return return4Fail(401, 0, '当前登录用户无权使用本接口。')
  if(!reqBody.template || reqBody.template == '') return return4Fail(400,0, "未选定模板。")
  SQLStatement = 'SELECT * FROM project_temple WHERE id = '+reqBody.template
  var template = (yield dbOps(SQLStatement, callback.next))[0]
  if(!template) return return4Fail(404,0, "目标模板不存在。")
  if(template.status != 0) return return4Fail(404,1, "目标模板不在草稿状态。")
  SQLStatement = 'SELECT * FROM bind WHERE template = '+reqBody.template
  if(!(yield dbOps(SQLStatement, callback.next))[0]) return return4Fail(400, 2, '模板尚未绑定流程。')
  SQLStatement = 'UPDATE project_temple SET status = 1 WHERE id = '+reqBody.template
  yield dbOps(SQLStatement, callback.next)
  return4Success(null)
})}
