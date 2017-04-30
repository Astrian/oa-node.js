var debug = require('debug')('oa: api/project/newtemplate');
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西(function* (回调) {
    var 成功返回 = api.back4Success
    var 失败返回 = api.back4Fail
    if(!请求体.id || 请求体.id == '') return 失败返回(400, 0 ,'专案 ID 未填写。')
    var 返回值 = 空
    var SQL语句 = 'SELECT 所属部门'
    成功返回(空)
  })
}