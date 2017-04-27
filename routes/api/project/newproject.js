var debug = require('debug')('oa: api/project/newtemplate');
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null

module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西 (function *(回调){
    var 失败返回 = api.back4Fail
    var 成功返回 = api.back4Success
    if(!请求体.模板ID || 请求体.模板ID == '') return 失败返回(400, 3, '未填写模板 ID')
    if(!请求体.数据 || 请求体.数据 == '') return 失败返回(400, 3, '未填写数据')
    var SQL语句 = 'SELECT * FROM project_temple WHERE id = '+请求体.模板ID
    var 数据库结果 = yield 调用数据库(SQL语句, 回调.next)
    if(!数据库结果[0] || 数据库结果[0].状态 != 1) return 失败返回(404,1,'模板不存在（ID 错误），或尚未发布。')
    var 专案模板数据 = JSON.parse( 数据库结果[0].表字段)
    var 用户填写数据 = 请求体.数据
    if(专案模板数据.length != 用户填写数据.length)
    成功返回(空)
  })
}
