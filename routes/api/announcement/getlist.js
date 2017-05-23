var debug = require('debug')('oa:api/announcement/send');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
module.exports = function (req, res, api, reqBody) {cleanCallback(function* (callback) {
  var return4Success = api.back4Success
  var loginUID = req.session.user
  var SQLStatement = 'SELECT 所属部门 FROM user WHERE id = '+loginUID
  var userNode = ((yield dbOps(SQLStatement, callback.next))[0]).node
  SQLStatement = 'SELECT id, title, publisher, time FROM announcements WHERE visible = -1 OR visible = '+userNode+' ORDER BY time DESC'
  var annList = yield dbOps(SQLStatement, callback.next)
  for (var i in annList){
    SQLStatement = 'SELECT firstname, lastname, avatar FROM user WHERE id = '+annList[i].publisher
    annList[i].publisher = (yield dbOps(SQLStatement, callback.next))[0]
  }
  return4Success(annList)
})}
