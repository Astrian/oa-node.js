var 调用数据库 = require('../../modules/Db').exec
var debug = require('debug')('oa: api/node/getnodelist');
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西(function* (回调) {
    var 成功返回 = api.back4Success
    var 失败返回 = api.back4Fail
    var SQL语句
    var 输出结果 = yield 调用数据库('SELECT 名称 FROM node', 回调.next);
    var 结果 = []
    for(var i in 输出结果){
      结果 = 结果.concat([ 输出结果[i].名称 ])
    }
    return 成功返回(结果)
  })
}