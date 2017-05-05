var 调用数据库 = require('../../modules/Db').exec
var 随机数生成器 = require('crypto-random-string')
var 回调函数是一个反人类的东西 = require('sync_back').run
var debug = require('debug')('oa:api/node/getnodesheet');
module.exports = function (req, res, api, 请求体) {回调函数是一个反人类的东西(function* (回调){
  var 成功返回 = api.back4Success
  var SQL语句 = 'SELECT * FROM node'
  var 结果 = yield 调用数据库(SQL语句, 回调.next)
  for(var i in 结果){
    if(结果[i].父级部门ID){
      SQL语句 = 'SELECT 名称 FROM node WHERE id = '+结果[i].父级部门ID
      结果[i].父级部门 = (yield 调用数据库(SQL语句, 回调.next))[0].名称
    }
    if(结果[i].部门经理ID){
      SQL语句 = 'SELECT 姓,名,头像 FROM user WHERE id = '+结果[i].部门经理ID
      结果[i].部门经理 = (yield 调用数据库(SQL语句, 回调.next))[0]
    }
  }
  成功返回(结果)
})}