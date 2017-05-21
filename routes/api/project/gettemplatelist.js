var dbOps = require('../../modules/Db').exec
var debug = require('debug')('oa: api/project/gettemplatelist');
var cleanCallback = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, reqBody) {
  cleanCallback(function* (callback) {
    var return4Success = api.back4Success
    var return4Fail = api.back4Fail
    if(!reqBody.type || reqBody.type == '') return return4Fail(400,0,'未填写请求列表类型。')
    var loginUID = req.session.user
    var SQLStatement
    if (reqBody.type == 1) {
      SQLStatement = 'SELECT id, title, description FROM project_temple WHERE status = 1';
      var dbResult = yield dbOps(SQLStatement, callback.next);
      return return4Success(dbResult)
    }else if (reqBody.type == 2) {
      SQLStatement = 'SELECT id, title, description, status FROM project_temple WHERE creator = '+loginUID
      debug(SQLStatement)
      var dbResult = yield dbOps(SQLStatement, callback.next);
      return return4Success(dbResult)
    }else{
      return return4Fail(400,1,'请求类型不正确。')
    }
  })
}
