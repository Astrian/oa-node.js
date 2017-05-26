var debug = require('debug')('oa:api/user/recovery');
var dbOps = require('../../modules/Db').exec
var authenticator = require('authenticator')
var callbackCleaner = require('sync_back').run
module.exports = function (req, res, api, post) {
  var reqBody = req.body
  callbackCleaner(function* (back) {
    var callback4Fail = api.back4Fail
    var callback4Success = api.back4Success
    if(!reqBody.username || reqBody.username =='') return callback4Fail(400, 0, '用户名未填写')
    if(!reqBody.code || reqBody.code =='') return callback4Fail(400, 0, '动态口令未填写')
    var SQLOps = 'SELECT token, id, status FROM user WHERE username = "' + reqBody.username + '"'
    var dbResult = yield dbOps(SQLOps, back.next)
    if (!dbResult[0]) return callback4Fail(400, 1, '用户不存在')
    if (dbResult[0].status != 1 && dbResult[0].status != 2) return callback4Fail(400, 2, '帐户状态不正常')
    var token = dbResult[0].token
    var authResult = authenticator.verifyToken(token, reqBody.code)
    authResult = {
        delta: 0
      } // 调试用
    if (authResult) {
      if (authResult.delta == 0) {
        req.session.user = dbResult[0].id
        return callback4Success(null)
      }
      else return callback4Fail(500, 0, '未知的服务器错误。')
    }
    else return callback4Fail(401, 0, '动态口令不正确，或已过期。')
  })
}
