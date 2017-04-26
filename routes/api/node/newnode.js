var debug = require('debug')('oa:api/node/newnode');
var 调用数据库 = require('../../modules/Db').exec
var 消灭回调函数 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, post) {
  var 请求体 = req.body
  消灭回调函数(function* (回调) {
    var 失败返回 = api.back4Fail
    var 成功返回 = api.back4Success
    var SQL语句 = 'SELECT 帐户状态 FROM user WHERE id = ' + req.session.user
    var 数据库结果 = yield 调用数据库(SQL语句, 回调.next)
    if (数据库结果[0].帐户状态 != 2) return 失败返回(401, 1, "非管理员，无权使用该接口。")
    if (!请求体.部门名称 || 请求体.部门名称 == '') return 失败返回(400, 0, '部门名称未填写。')
    var SQL语句 = 'SELECT * FROM node WHERE 名称 = "' + 请求体.部门名称 + '"'
    var 查询结果 = yield 调用数据库(SQL语句, 回调.next)
    if (查询结果[0]) return 失败返回(400, 1, '部门名称已被占用。')
    var 结果执行的SQL前半语句 = 'INSERT INTO node (名称'
    var 结果执行的SQL后半语句 = 'VALUES ("' + 请求体.部门名称 + '"'
    var 部门经理ID
    if (请求体.部门经理) {
      if (请求体.部门经理 != '') {
        SQL语句 = 'SELECT * FROM user WHERE 用户名 = "' + 请求体.部门经理 + '"'
        查询结果 = yield 调用数据库(SQL语句, 回调.next)
        if (!查询结果[0]) return 失败返回(400, 2, '部门经理不存在。')
        else {
          结果执行的SQL前半语句 = 结果执行的SQL前半语句 + ', 部门经理ID'
          结果执行的SQL后半语句 = 结果执行的SQL后半语句.concat(', ', 查询结果[0].id)
          部门经理ID = 查询结果[0].id
          SQL语句 = 'UPDATE node SET 部门经理ID = null WHERE 部门经理ID = ' + 部门经理ID
          yield 调用数据库(SQL语句, 回调.next)
        }
      }
    }
    if (请求体.父部门) {
      if (请求体.父部门 != '') {
        SQL语句 = 'SELECT * FROM node WHERE 名称 = "' + 请求体.父部门 + '"'
        查询结果 = yield 调用数据库(SQL语句, 回调.next)
        if (查询结果 == []) return 失败返回(400, 3, '父部门不存在。')
        else {
          结果执行的SQL前半语句 = 结果执行的SQL前半语句 + ', 父级部门ID'
          结果执行的SQL后半语句 = 结果执行的SQL后半语句.concat(', ', 查询结果[0].id)
        }
      }
    }
    if (请求体.是人事部) {
      结果执行的SQL前半语句 = 结果执行的SQL前半语句 + ', 是人事部'
      结果执行的SQL后半语句 = 结果执行的SQL后半语句.concat(', 1')
    }
    else {
      结果执行的SQL前半语句 = 结果执行的SQL前半语句 + ', 是人事部'
      结果执行的SQL后半语句 = 结果执行的SQL后半语句.concat(', 0')
    }
    结果执行的SQL前半语句 = 结果执行的SQL前半语句 + ')'
    结果执行的SQL后半语句 = 结果执行的SQL后半语句 + ')'
    debug(结果执行的SQL前半语句.concat(结果执行的SQL后半语句))
    查询结果 = yield 调用数据库((结果执行的SQL前半语句.concat(结果执行的SQL后半语句)), 回调.next)
    debug(查询结果)
    if (请求体.部门经理) {
      if (请求体.部门经理 != '') {
        SQL语句 = 'UPDATE user SET 所属部门 = ' + 查询结果.insertId + ' WHERE id = ' + 部门经理ID
        yield 调用数据库(SQL语句, 回调.next)
      }
    }
    成功返回(空)
  })
}