var debug = require('debug')('oa: api/project/newtemplate');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
module.exports = function (req, res, api, reqBody) {cleanCallback(function* (callback) {
  var return4Success = api.back4Success
  var return4Fail = api.back4Fail
  var loginUID = req.session.user
  if (!reqBody.type || reqBody.type == '') return return4Fail(400, 0, '请求类型未定义。')
  var returnResult
  switch(reqBody.type){
    case '1': // 获取需要我处理的专案
      SQLStatement = 'SELECT id,applyer, submittime, template, status FROM project WHERE whoisprocessing = ' + loginUID+' AND status <> -1 AND status <> -4 ORDER BY submittime DESC'
      returnResult = yield dbOps(SQLStatement, callback.next)
      break;
    case '2': // 获取我提交的专案
      SQLStatement = 'SELECT id, applyer, submittime, template, status FROM project WHERE applyer = ' + loginUID+' ORDER BY submittime DESC'
      returnResult = yield dbOps(SQLStatement, callback.next)
      break;
    case '3': // 获取我处理过的专案
      returnResult = []
      SQLStatement = 'SELECT project FROM project_log WHERE user = '+loginUID+' ORDER BY time DESC'
      var logs = yield dbOps(SQLStatement, callback.next)
      for(var i in logs){
        var value = false
        for(var j in returnResult) {if(returnResult[j] != logs[i].project) value = true}
        if(value || returnResult.length == 0) returnResult.push(logs[i].project)
      }
      debug(returnResult)
      for(var i in returnResult){
        SQLStatement = 'SELECT id, applyer, submittime, template, status FROM project WHERE id = ' + returnResult[i]
        returnResult[i] = (yield dbOps(SQLStatement, callback.next))[0]
      }
      break;
    default:
      break;
  }
  if (returnResult[0]) {
    for (var i in returnResult) {
      SQLStatement = 'SELECT id, title FROM project_temple WHERE id = ' + returnResult[i].template
      result = yield dbOps(SQLStatement, callback.next)
      returnResult[i].template = result[0]
      SQLStatement = 'SELECT firstname, lastname, avatar FROM user WHERE id = ' + returnResult[i].applyer
      result = yield dbOps(SQLStatement, callback.next)
      returnResult[i].applyer = result[0]
    }
  }
  return4Success(returnResult)
})}
