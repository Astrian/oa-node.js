var debug = require('debug')('oa: api/project/newflow');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
module.exports = function (req, res, api, reqBody) {cleanCallback(function* (callback) {
  var return4Fail = api.back4Fail
  var return4Success = api.back4Success
  var loginUID = req.session.user
  var SQLStatement = 'SELECT status, node FROM user WHERE id = '+loginUID
  var userInfo = (yield dbOps(SQLStatement, callback.next))[0]
  SQLStatement = 'SELECT ispersonnel FROM node WHERE id = '+userInfo.node
  userInfo.isPersonnel = (yield dbOps(SQLStatement, callback.next))[0].ispersonnel
  if(userInfo.status != 2 && userInfo.isPersonnel != 1) return return4Fail(401, 0, '当前登录用户无权使用本接口。')
  if(!reqBody.title || reqBody.title == '') return return4Fail(400,0, "标题未填写。")
  if(!reqBody.description || reqBody.description == '') return return4Fail(400,0, "描述未填写。")
  if(!reqBody.flow || reqBody.flow == '') return return4Fail(400,0, "流程未填写。")
  for (var i in reqBody.flow){
    if(reqBody.flow[i] == -1){
      if(i != 0) return return4Fail(400,3,'非第一步无法选择「申请人的部门经理」的选项.')
    }else if(reqBody.flow[i] == -2){
      if(i == 0) return return4Fail(400,2,'第一步无法选择「由上一步决定此步骤负责人」的选项。')
    }else{
      SQLStatement = 'SELECT id FROM user WHERE id = '+reqBody.flow[i]
      var result = (yield dbOps(SQLStatement, callback.next))[0]
      var j = (+i)+1
      if(!result) return return4Fail(400, 1, '流程中，第 '+j+' 步 UID 不存在。')
    }
  }
  SQLStatement = "INSERT INTO flow (title, description, flow, status) VALUES('"+reqBody.title+"', '"+reqBody.description+"', '"+JSON.stringify(reqBody.flow)+"', 1)"
  var result = yield dbOps(SQLStatement, callback.next)
  return4Success({
    id: result.insertId
  })
})}
