var 调用数据库 = require('../../modules/Db')
var debug = require('debug')('oa: api/project/newtemplate');
var 回调函数是一个反人类的东西 = require('sync_back').run
var 类型判断 = require('util')
module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西(function* (回调) {
    var 失败返回 = api.back4Fail
    var 成功返回 = api.back4Success
    if (!请求体.标题 || 请求体.标题 == '') return 失败返回(400, 0, "标题未填写。")
    if (!请求体.描述 || 请求体.描述 == '') return 失败返回(400, 0, "描述未填写。")
    if (!请求体.表单内容) return 失败返回(400, 0, "缺少字段。")
    if (!请求体.流程) return 失败返回(400, 0, "缺少流程。")
    var 流程 = 请求体.流程;
    for (var i in 流程) {
      if (!流程[i] || 流程[i] == '') return 失败返回(400, 3, "流程不完整。")
      var 判断值TOF = '';
      if (类型判断.isArray(流程[i].判断)) {
        for (var k in 流程[i].判断.条件) {
          switch (k) {
            case '<':
            case '<=':
            case '>':
            case '>=':
            case '=': break;
            default: 判断值TOF = '字段有错误：判断值不是有效的符号'
          }
        }
      }
      else {
        if (流程[i].判断 != "其他") 判断值TOF = '字段有错误：判断值不应该是一个不正确的字符串。'
      }
      if (判断值TOF != '') return 失败返回(400, 4, 判断值TOF)
    }
    var 表单 = 请求体.表单内容
    for (var j in 表单) {
      if (表单[j] == '') return 失败返回(400, 3, "流程不完整。")
      var 字段 = 表单[j]
      if (!字段.名称 || 字段.名称 == '') return 失败返回(400, 3, "流程不完整。")
      if (!字段.描述 || 字段.描述 == '') return 失败返回(400, 3, "流程不完整。")
      if (!字段.类型 || 字段.类型 == '') return 失败返回(400, 3, "流程不完整。")
    }
    var SQL语句 = "INSERT INTO project_temple (标题, 描述, 表字段, 流程, 状态, 创建者, 创建时间) VALUES ('" + 请求体.标题 + "', '" + 请求体.描述 + "','" + JSON.stringify(请求体.表单内容) + "', '" + JSON.stringify(请求体.流程) + "', 0, "+req.session.user+", " + new Date().getTime() + " )";
    var 数据库结果 = yield 调用数据库.exec(SQL语句, 回调.next)
    成功返回({
      表单ID: 数据库结果.insertId
    })
  })
}
