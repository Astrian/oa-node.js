var dbOps = require('../../modules/Db').exec
var randomDigitGen = require('crypto-random-string')
var cleanCallback = require('sync_back').run
var debug = require('debug')('oa:api/user/newuser');
module.exports = function (req, res, api, post) {
  var reqBody = req.body
  var return4Fail = api.back4Fail
  var return4Success = api.back4Success
  cleanCallback(function* (callback) {
    var SQLStatement = 'SELECT node FROM user WHERE id = ' + req.session.user
    var result = yield dbOps(SQLStatement, callback.next)
    SQLStatement = 'SELECT ispersonnel FROM node WHERE id = '+result[0].node
    result = yield dbOps(SQLStatement, callback.next)
    if(result[0].ispersonnel != 1) return return4Fail(401, 1, "非人事部门，无权使用该接口。")
    if(!reqBody.username || reqBody.username == '') return return4Fail(400, 0, "未填写用户名。")
    if(!reqBody.mail || reqBody.mail == '') return return4Fail(400, 0, "未填写用户名。")
    if(!reqBody.firstname || reqBody.firstname == '') return return4Fail(400, 0, "未填写姓（First name）。")
    if(!reqBody.lastname || reqBody.lastname == '') return return4Fail(400, 0, "未填写名（Last name）。")
    if(!reqBody.avatar || reqBody.avatar == '') return return4Fail(400, 0, "未填写头像。")
    if(!reqBody.node || reqBody.node == '') return return4Fail(400, 0, "未填写所属部门。")
    SQLStatement = 'SELECT * FROM user WHERE username = "'+reqBody.username+'"'
    result = yield dbOps(SQLStatement, callback.next)
    if(result[0]) return return4Fail(400, 1, "用户名已被占用。")
    SQLStatement = 'SELECT * FROM node WHERE id = '+reqBody.node
    var node = yield dbOps(SQLStatement, callback.next)
    if(!node[0]) return return4Fail(400, 2, "所属部门不存在。")
    else node = node[0]
    SQLStatement = 'INSERT INTO user (username, mail, firstname, lastname, avatar, node, status) VALUES ("'+reqBody.username+'", "'+reqBody.mail+'","'+reqBody.firstname+'","'+reqBody.lastname+'","'+reqBody.avatar+'","'+node.id+'", 0)'
    result = yield dbOps(SQLStatement, callback.next)
    var recovery = randomDigitGen(16)
    SQLStatement = 'INSERT INTO user_recovery (id, recovery) VALUES ("'+result.insertId+'", "'+recovery+'")'
    yield dbOps(SQLStatement, callback.next)
    return return4Success({
      recovery: recovery
    })
  })
}
