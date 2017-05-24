var debug = require('debug')('oa:api/node/newnode');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, post) {
  var reqBody = req.body
  cleanCallback(function* (callback) {
    var return4Fail = api.back4Fail
    var return4Success = api.back4Success
    var SQLStatement = 'SELECT status FROM user WHERE id = ' + req.session.user
    var result = yield dbOps(SQLStatement, callback.next)
    if (result[0].status != 2) return return4Fail(401, 1, "非管理员，无权使用该接口。")
    if (!reqBody.name || reqBody.name == '') return return4Fail(400, 0, '部门名称未填写。')
    var SQLStatement = 'SELECT * FROM node WHERE title = "' + reqBody.name + '"'
    var queryResult = yield dbOps(SQLStatement, callback.next)
    if (queryResult[0]) return return4Fail(400, 1, '部门名称已被占用。')
    var firstHalf4SQLStatement = 'INSERT INTO node (title'
    var lastHalf4SQLStatement = 'VALUES ("' + reqBody.name + '"'
    var manager
    if (reqBody.manager) {
      if (reqBody.manager != '') {
        SQLStatement = 'SELECT * FROM user WHERE 用户名 = "' + reqBody.manager + '"'
        queryResult = yield dbOps(SQLStatement, callback.next)
        if (!queryResult[0]) return return4Fail(400, 2, '部门经理不存在。')
        else {
          firstHalf4SQLStatement = firstHalf4SQLStatement + ', manager'
          lastHalf4SQLStatement = lastHalf4SQLStatement.concat(', ', queryResult[0].id)
          manager = queryResult[0].id
          SQLStatement = 'UPDATE node SET manager = null WHERE manager = ' + manager
          yield dbOps(SQLStatement, callback.next)
        }
      }
    }
    if (reqBody.parentnode) {
      if (reqBody.parentnode != '') {
        SQLStatement = 'SELECT * FROM node WHERE 名称 = "' + reqBody.parentnode + '"'
        queryResult = yield dbOps(SQLStatement, callback.next)
        if (queryResult == []) return return4Fail(400, 3, '父部门不存在。')
        else {
          firstHalf4SQLStatement = firstHalf4SQLStatement + ', parentnode'
          lastHalf4SQLStatement = lastHalf4SQLStatement.concat(', ', queryResult[0].id)
        }
      }
    }
    if (reqBody.ispersonnel) {
      firstHalf4SQLStatement = firstHalf4SQLStatement + ', ispersonnel'
      lastHalf4SQLStatement = lastHalf4SQLStatement.concat(', 1')
    }
    else {
      firstHalf4SQLStatement = firstHalf4SQLStatement + ', ispersonnel'
      lastHalf4SQLStatement = lastHalf4SQLStatement.concat(', 0')
    }
    firstHalf4SQLStatement = firstHalf4SQLStatement + ')'
    lastHalf4SQLStatement = lastHalf4SQLStatement + ')'
    debug(firstHalf4SQLStatement.concat(lastHalf4SQLStatement))
    queryResult = yield dbOps((firstHalf4SQLStatement.concat(lastHalf4SQLStatement)), callback.next)
    debug(queryResult)
    if (reqBody.ispersonnel) {
      if (reqBody.ispersonnel != '') {
        SQLStatement = 'UPDATE user SET node = ' + queryResult.insertId + ' WHERE id = ' + manager
        yield dbOps(SQLStatement, callback.next)
      }
    }
    return4Success(null)
  })
}
