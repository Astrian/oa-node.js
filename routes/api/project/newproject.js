var debug = require('debug')('oa: api/project/newtemplate');
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var 类型判断 = require('util')
var 空 = null

module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西 (function *(回调){
    var 失败返回 = api.back4Fail
    var 成功返回 = api.back4Success
    var 登录用户 = req.session.user
    if(!请求体.模板ID || 请求体.模板ID == '') return 失败返回(400, 3, '未填写模板 ID。')
    if(!请求体.数据 || 请求体.数据 == '') return 失败返回(400, 3, '未填写数据。')
    var SQL语句 = 'SELECT * FROM project_temple WHERE id = '+请求体.模板ID
    var 数据库结果 = yield 调用数据库(SQL语句, 回调.next)
    if(!数据库结果[0] || 数据库结果[0].状态 != 1) return 失败返回(404,1,'模板不存在（ID 错误），或尚未发布。')
    var 专案模板数据 = JSON.parse(数据库结果[0].表字段)
    var 用户填写数据 = 请求体.数据
    if(专案模板数据.length != 用户填写数据.length) return 失败返回(400, 0, '字段不完整。')
    for(var i in 专案模板数据){
      if(!类型判断.isArray(专案模板数据[i].类型)){
        switch (专案模板数据[i].类型){
          case '字段': if(!(类型判断.isString(用户填写数据[i]))) return 失败返回(400, 0, '字段 '+专案模板数据[i].名称+' 的类型出错，它应该是一个字段。'); break;
          case '文本': if(!(类型判断.isString(用户填写数据[i]))) return 失败返回(400, 0, '字段 '+专案模板数据[i].名称+' 的类型出错，它应该是一段文本。'); break;
          case '数字': if(!(类型判断.isNumber(+用户填写数据[i]))) return 失败返回(400, 0, '字段 '+专案模板数据[i].名称+' 的类型出错，它应该是一个数字。'); break;
        }
      }
      else{
        if(!(类型判断.isNumber(用户填写数据[i]))) return 失败返回(400, 0, '字段 '+专案模板数据[i].名称+' 的类型出错，它应该是相应数组中某一个元素的位址。')
        if(!专案模板数据[i].类型[用户填写数据[i]]) return 失败返回(400, 0, '所选数据（'+用户填写数据[i]+'）不在数组 '+专案模板数据[i].名称+' 的范围内')
      }
    }
    SQL语句 = "INSERT INTO project (申请人, 申请时间, 模板, 数据, 状态) VALUES ('" + 登录用户 + "', " + new Date().getTime() + ",'"+请求体.模板ID+"', '"+JSON.stringify(用户填写数据)+"', 0)";
    数据库结果 = yield 调用数据库(SQL语句, 回调.next)
    成功返回({
      专案ID: 数据库结果.insertId
    })
  })
}
