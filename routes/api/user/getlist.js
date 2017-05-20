var debug = require('debug')('oa:api/user/getlist');
var dbOps = require('../../modules/Db').exec
var callbackCleaner = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, reqBody) {callbackCleaner(function* (callback) {
  var callback4Success = api.back4Success
  var callback4Fail = api.back4Fail
  var 登录用户 = req.session.user
  var SQLOps = 'SELECT id, username, firstname, lastname, mail, avatar, node FROM user'
  var dbResult = yield dbOps(SQLOps, callback.next)
  for(var i in dbResult){
    SQLOps = 'SELECT * FROM node WHERE id = '+dbResult[i].node
    dbResult[i].node = (yield dbOps(SQLOps, callback.next))[0]
  }
  callback4Success(dbResult)
})}
