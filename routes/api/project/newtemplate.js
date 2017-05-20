var opsDb = require('../../modules/Db').exec
var debug = require('debug')('oa: api/project/newtemplate');
var cleanCallback = require('sync_back').run
var typeJudger = require('util')
module.exports = function (req, res, api, reqBody) {
  cleanCallback(function* (callbackApi) {
    var callback4Fail = api.back4Fail
    var callback4Success = api.back4Success
    var loginUID = req.session.user
    var SQLOps = 'SELECT node,status FROM user WHERE id = '+loginUID
    var loginUserInfo = (yield opsDb(SQLOps, callbackApi.next))[0]
    SQLOps = 'SELECT ispersonnel FROM node WHERE id = '+loginUserInfo.node
    var isPersonnel = (yield opsDb(SQLOps, callbackApi.next))[0].ispersonnel
    if(!isPersonnel && loginUserInfo.status!=2) return callback4Fail(401,0,"当前登录用户无权使用本接口。")
    if (!reqBody.title || reqBody.title == '') return callback4Fail(400, 0, "标题未填写。")
    if (!reqBody.description || reqBody.description == '') return callback4Fail(400, 0, "描述未填写。")
    if (!reqBody.sheets) return callback4Fail(400, 0, "缺少字段。")
    else{
      for(var i in reqBody.sheets){
        if(!(reqBody.sheets[i].title) || reqBody.sheets[i].title == "" || !(typeJudger.isString(reqBody.sheets[i].title))) return callback4Fail(400,0,"字段标题不是字符串。")
        if(!(reqBody.sheets[i].description) || reqBody.sheets[i].description == "" || !(typeJudger.isString(reqBody.sheets[i].description))) return callback4Fail(400,0,"字段描述不是字符串。")
        if(!(typeJudger.isObject(reqBody.sheets[i].type)) && reqBody.sheets[i].type != "number" && reqBody.sheets[i].type != "string" && reqBody.sheets[i].type != 'text' ) return callback4Fail(400,0,"字段类型不正确。")
      }
    }
    SQLOps = "INSERT INTO project_temple (title, description, sheets, status, creator, createat) VALUES ('"+reqBody.title+"',  '"+reqBody.description+"',  '"+JSON.stringify(reqBody.sheets)+"', 0, '"+loginUID+"', "+new Date().getTime()+")"
    var insertResult = (yield opsDb(SQLOps, callbackApi.next))
    callback4Success({
      'id': insertResult.insertId
    })
  })
}
