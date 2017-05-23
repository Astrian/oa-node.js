var debug = require('debug')('oa:api/user/recovery');
var dbOps = require('../../modules/Db').exec
var authenticator = require('authenticator')
var cleanCallback = require('sync_back').run
module.exports = function (req, res, api, post) {
  var reqBody = req.body
  var return4Fail = api.back4Fail
  var return4Success = api.back4Success
  cleanCallback(function* (callback) {
    if (!reqBody.username || reqBody.username == '') return return4Fail(400, 0, '用户名未填写。')
    if (!reqBody.recovery || reqBody.recovery == '') return return4Fail(400, 0, '恢复密钥未填写。')
    if (!reqBody.code || reqBody.code == '') return return4Fail(400, 0, '验证码未填写。')
    var SQLStatement = 'SELECT * FROM user WHERE username = "' + reqBody.username + '"'
    var result = yield dbOps(SQLStatement, callback.next)
    var user
    if (!result[0]) return return4Fail(400, 1, '用户名不存在。')
    if(result[0].status != 0) return return4Fail(400, 2, '帐户不在恢复状态')
    user = result[0]
    SQLStatement = 'SELECT * FROM user_recovery WHERE id = ' + user.id + ' AND recovery = "' + reqBody.recovery + '"'
    var result = yield dbOps(SQLStatement, callback.next)
    if (!result[0]) return return4Fail(401, 1, '恢复密钥错误，或帐户不在恢复状态。')
    var verifyResult = authenticator.verifyToken(user.token, reqBody.code);
    if (verifyResult) {
      if (verifyResult.delta == 0) {
        req.session.user = user.id
        SQLStatement = 'DELETE FROM user_recovery WHERE id = ' + user.id
        yield dbOps(SQLStatement, callback.next)
        SQLStatement = 'UPDATE user SET status = 1 WHERE id = '+user.id
        yield dbOps(SQLStatement, callback.next)
        return return4Success(null)
      }
      else return return4Fail(500, 0, '未知的服务器错误。')
    }
    else return return4Fail(400, 2, '动态验证码不正确，或已过期。')
  })
}
