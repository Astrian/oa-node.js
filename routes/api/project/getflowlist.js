var dbOps = require('../../modules/Db').exec
var debug = require('debug')('oa: api/project/getflowlist');
var cleanCallback = require('sync_back').run
module.exports = function (req, res, api, reqBody) {
  cleanCallback(function* (callback) {
    var return4Success = api.back4Success
    var return4Fail = api.back4Fail
    if(!reqBody.type || reqBody.type == '') return return4Fail(400,0,'未填写请求列表类型。')
    var loginUID = req.session.user
    var SQLStatement
    if (reqBody.type == 1) {
      SQLStatement = 'SELECT id, title, description, status FROM flow WHERE status = 1';
      var dbResult = yield dbOps(SQLStatement, callback.next);
      return return4Success(dbResult)
    }else if (reqBody.type == 2) {
      SQLStatement = 'SELECT node, status FROM user WHERE id = '+loginUID
      var result = (yield dbOps(SQLStatement, callback.next))[0]
      SQLStatement = 'SELECT ispersonnel FROM node WHERE id = '+result.node
      if(result.status == 2 || (yield dbOps(SQLStatement, callback.next))[0].ispersonnel == 1){
        SQLStatement = 'SELECT id, title, description, status FROM flow'
        var dbResult = yield dbOps(SQLStatement, callback.next);
        return return4Success(dbResult)
      }else{
        return return4Fail(401,1,'当前用户无权获取所有流程列表。')
      }
    }else{
      return return4Fail(400,1,'请求类型不正确。')
    }
  })
}
