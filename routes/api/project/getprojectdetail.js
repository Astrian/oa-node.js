var debug = require('debug')('oa: api/project/getprojectdetail');
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西(function* (回调) {
    var 成功返回 = api.back4Success
    var 失败返回 = api.back4Fail
    var 登录用户 = req.session.user
    if(!请求体.id || 请求体.id == '') return 失败返回(400, 0 ,'专案 ID 未填写。')
    var 返回值 = 空
    var SQL语句 = 'SELECT 所属部门 FROM user WHERE id = '+登录用户
    var 数据库结果 = yield 调用数据库(SQL语句, 回调.next)
    var 所属部门 = 数据库结果[0].所属部门
    SQL语句 = 'SELECT * FROM project WHERE (申请人 = '+登录用户+' OR 目前处理的部门 = '+数据库结果[0].所属部门+') AND id = '+请求体.id
    debug(SQL语句)
    var 输出结果 = yield 调用数据库(SQL语句, 回调.next)
    debug(输出结果[0])
    if(!输出结果[0]) return 失败返回(404, 0 ,'没有相应专案，或当前登录用户无权查看该专案。')
    输出结果[0].数据 = JSON.parse(输出结果[0].数据)
    输出结果 = 输出结果[0]
    SQL语句 = 'SELECT 姓, 名 FROM user WHERE id = '+输出结果.申请人
    数据库结果 = yield 调用数据库(SQL语句, 回调.next)
    输出结果.申请人 = (数据库结果[0].姓).concat(数据库结果[0].名)
    SQL语句 = 'SELECT * FROM project_temple WHERE id = '+输出结果.模板
    数据库结果 = yield 调用数据库(SQL语句, 回调.next)
    输出结果.模板 = 数据库结果[0].标题
    数据库结果 = JSON.parse(数据库结果[0].表字段)
    var json = '['
    for(var i in 数据库结果){
      if(i != 0) json = json + ','
      json = json+'{"名称":"'+数据库结果[i].名称+'","数据": "'+输出结果.数据[i]+'"}'
    }
    输出结果.数据 = JSON.parse(json+']')
    SQL语句 = 'SELECT 操作人, 行为, 操作时间 FROM project_log WHERE 专案ID = '+ 请求体.id +' ORDER BY 操作时间 DESC'
    数据库结果 = yield 调用数据库(SQL语句, 回调.next)
    for(var i in 数据库结果){
      SQL语句 = 'SELECT 姓, 名 FROM user WHERE id = '+ 数据库结果[i].操作人
      var 结果 = yield 调用数据库(SQL语句, 回调.next)
      数据库结果[i].操作人 = (结果[0].姓).concat(结果[0].名)
      debug(数据库结果[i])
    }
    输出结果.流程历史 = 数据库结果
    json = []
    SQL语句 = 'SELECT * FROM project WHERE 目前处理的部门 = '+所属部门+' AND id = '+请求体.id
    数据库结果 = yield 调用数据库(SQL语句, 回调.next)
    if(数据库结果.length != 0) json = json.concat('审核')
    SQL语句 = 'SELECT * FROM project WHERE 申请人 = '+登录用户+' AND id = '+请求体.id
    数据库结果 = yield 调用数据库(SQL语句, 回调.next)
    if(数据库结果.length != 0) json = json.concat('申请')
    输出结果.操作权限 = json
    成功返回(输出结果)
  })
}