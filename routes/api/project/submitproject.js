var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
var debug = require('debug')('oa:api/project/submitproject');

module.exports = function (req, res, api, reqBody) {cleanCallback(function*(callback){
  var loginUID = req.session.user
  var return4Success = api.back4Success
  var return4Fail = api.back4Fail
  if(!reqBody.project || reqBody.project == '') return return4Fail(400, 0, "未填写专案 ID。")
  var SQLStatement = 'SELECT * FROM project WHERE id = '+reqBody.project+' AND applyer = '+loginUID
  var result = yield dbOps(SQLStatement, callback.next)
  if (!result[0]) return return4Fail(404,0, "专案不存在，或当前登录用户无权提交当前专案。")
  if(result[0].status != -1) return return4Fail(400,1, "相应专案已被删除、归档，或已在审核状态（非草稿状态）。")
  var project = result[0]
  //bla
  return4Success(null)
})}
