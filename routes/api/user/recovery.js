var debug = require('debug')('oa:api/user/recovery');
var dbOps = require('../../modules/Db').exec
var authenticator = require('authenticator')
var cleanCallback = require('sync_back').run
module.exports = function (req, res, api, post) {cleanCallback(function* (callback) {
  var reqBody = req.body
  var return4Fail = api.back4Fail
  var return4Success = api.back4Success
  if(!reqBody.username || reqBody.username=='') return return4Fail(400, 0, '用户名未填写。')
  if(!reqBody.recovery || reqBody.recovery=='') return return4Fail(400, 0, '恢复密钥未填写。')
  var SQLStatement = 'SELECT * FROM user WHERE username = "'+reqBody.username+'"'
  var user = yield dbOps(SQLStatement,callback.next)
  if(!user[0]) return return4Fail(400, 1, '用户名不存在。')
  if(user[0].status != 0) return return4Fail(400, 2, '帐户不在恢复状态')
  else user = user[0]
  SQLStatement = 'SELECT * FROM user_recovery WHERE id = '+user.id+' AND recovery = "'+reqBody.recovery+'"'
  var result = yield dbOps(SQLStatement,callback.next)
  if(!result[0]) return return4Fail(401, 1, '恢复密钥错误。')
  var token = authenticator.generateKey()
  SQLStatement = 'UPDATE user SET token = "'+token+'" WHERE id = '+user.id
  yield dbOps(SQLStatement,callback.next)
  return return4Success({
    qrcode: authenticator.generateTotpUri(token, (user.firstname).concat(user.lastname),'企业 OA 系统', 'SHA1', 6, 30)
  })
})}
