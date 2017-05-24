var debug = require('debug')('oa: api/project/getprojectdetail');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
module.exports = function (req, res, api, reqBody) {cleanCallback(function* (callback) {
  var return4Success = api.back4Success
  var return4Fail = api.back4Fail
  if(!reqBody.id || reqBody.id =='') return return4Fail(400,0,'未填写模板 ID。')
  var loginUID = req.session.user
  var SQLStatement = 'SELECT * FROM project_temple WHERE (status = 1) AND id = '+reqBody.id
  var result = yield dbOps(SQLStatement, callback.next)
  if(!result[0]) return return4Fail(404,0,'模板不存在，或当前用户无权查看该模板信息。')
  result = result[0]
  result.sheets = JSON.parse(result.sheets)
  return4Success(result)
})}
