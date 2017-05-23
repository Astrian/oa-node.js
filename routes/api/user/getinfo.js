var debug = require('debug')('oa:api/user/recovery');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, post) {
  var 请求体 = req.body
  var 登录用户 = req.session.user
  cleanCallback(function* (callback) {
    var back4Fail = api.back4Fail
    var back4Success = api.back4Success
    var SQLStatement = 'SELECT id, username, firstname, lastname, avatar, node, status FROM user WHERE id = '+登录用户
    var user = (yield dbOps(SQLStatement, callback.next))[0]
    var SQLStatement = 'SELECT * FROM node WHERE id = '+user.node
    user.node = (yield dbOps(SQLStatement, callback.next))[0]
    back4Success(user)
  })
}
