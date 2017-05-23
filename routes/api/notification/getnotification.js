var debug = require('debug')('oa:api/notification/getnotification');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, reqBody) {
  cleanCallback(function * (callback){
    var return4Success = api.back4Success
    var loginUID = req.session.user
    var SQLStatement = 'SELECT * FROM notification WHERE reciver = '+loginUID+' ORDER BY time DESC'
    var result = yield dbOps(SQLStatement,callback.next)
    var SQLStatement = 'UPDATE notification SET `read` = 1 WHERE reciver = '+loginUID+' AND `read` = 0'
    debug(SQLStatement)
    yield dbOps(SQLStatement,callback.next)
    return4Success(result)
  })
}
