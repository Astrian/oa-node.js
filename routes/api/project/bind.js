var debug = require('debug')('oa: api/project/bind');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
var typeJudger = require('util')
module.exports = function (req, res, api, reqBody) {cleanCallback(function* (callback) {
  var return4Fail = api.back4Fail
  var return4Success = api.back4Success
  var loginUID = req.session.user
  var SQLStatement = 'SELECT status, node FROM user WHERE id = '+loginUID
  var userInfo = (yield dbOps(SQLStatement, callback.next))[0]
  SQLStatement = 'SELECT ispersonnel FROM node WHERE id = '+userInfo.node
  userInfo.isPersonnel = (yield dbOps(SQLStatement, callback.next))[0].ispersonnel
  if(userInfo.status != 2 && userInfo.isPersonnel != 1) return return4Fail(401, 0, '当前登录用户无权使用本接口。')
  if(!reqBody.template || reqBody.template == '') return return4Fail(400,0, "未选定模板。")
  if(!reqBody.routes || !(typeJudger.isArray(reqBody.routes))) return return4Fail(400,0, "流程判断值不正确。")
  var routes = reqBody.routes
  SQLStatement = 'SELECT * FROM project_temple WHERE id = '+reqBody.template
  var template = (yield dbOps(SQLStatement, callback.next))[0]
  var sheets = JSON.parse(template.sheets)
  if(!template) return return4Fail(404,0, "模板不存在。")

  // 判断用户输入是否正确
  for (var i in routes){
    if(typeJudger.isObject(routes[i].judge)){
      if(!sheets[routes[i].judge.field]) return return4Fail(400,2, "判断条件对应的模板字段不合要求。")
      switch (routes[i].judge.condition){
        case '>':
        case '<':
        case '>=':
        case '<=':
          if(sheets[routes[i].judge.field].type != 'number') return return4Fail(400,2, "判断条件对应的模板字段不合要求。")
        case '=':
          break;
        default:
          if(sheets[routes[i].judge.field].type != 'number') return return4Fail(400,3, "判断值不正确。")
      }
    }else if(routes[i].judge == 'other'){
      if(routes[(+i)+1]) return return4Fail(400,1, "「其他」后，不能有其他的路由判断条件。")
    }else{
      return return4Fail(400,0, "judge 值不符合要求。")
    }
  }

  // 从数据库清空原有绑定数据
  SQLStatement = 'DELETE FROM bind WHERE template = '+reqBody.template
  yield dbOps(SQLStatement, callback.next)

  // 写入数据库
  for(var i in routes){
    SQLStatement = "INSERT INTO bind (template, judge, flow) VALUES ("+reqBody.template+", '"+JSON.stringify(routes[i].judge)+"', "+routes[i].flow+")"
    yield dbOps(SQLStatement, callback.next)
  }
  return4Success(null)
})}
