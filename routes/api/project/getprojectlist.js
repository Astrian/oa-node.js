var debug = require('debug')('oa: api/project/newtemplate');
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西(function* (回调) {
    var 成功返回 = api.back4Success
    var 失败返回 = api.back4Fail
    var 登录用户 = req.session.user
    if (!请求体.type || 请求体.type == '') return 失败返回(400, 0, '请求类型未定义。')
    var 请求结果 = 空
    var SQL语句 = ''
    var 数据库结果
    if (请求体.type == 1) { // 获取需要我处理的专案
      SQL语句 = 'SELECT 所属部门 FROM user WHERE id = ' + 登录用户
      数据库结果 = yield 调用数据库(SQL语句, 回调.next)
      SQL语句 = 'SELECT id,申请人, 申请时间, 模板, 状态 FROM project WHERE 目前处理的部门 = ' + 数据库结果[0].所属部门+' AND 状态 = 1 ORDER BY 申请时间 DESC'
      请求结果 = yield 调用数据库(SQL语句, 回调.next)
    }
    else if (请求体.type == 2) {
      SQL语句 = 'SELECT id,申请人, 申请时间, 模板, 状态 FROM project WHERE 申请人 = ' + 登录用户+' ORDER BY 申请时间 DESC'
      请求结果 = yield 调用数据库(SQL语句, 回调.next)
    }
    if (请求结果[0]) {
      for (var i in 请求结果) {
        //请求结果[i].数据 = JSON.parse(请求结果[i].数据)
        SQL语句 = 'SELECT 标题 FROM project_temple WHERE id = ' + 请求结果[i].模板
        数据库结果 = yield 调用数据库(SQL语句, 回调.next)
        请求结果[i].模板 = 数据库结果[0].标题
        SQL语句 = 'SELECT 姓, 名 FROM user WHERE id = ' + 请求结果[i].申请人
        数据库结果 = yield 调用数据库(SQL语句, 回调.next)
        请求结果[i].申请人 = (数据库结果[0].姓).concat(数据库结果[0].名)
      }
    }
    成功返回(请求结果)
  })
}