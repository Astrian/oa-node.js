var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
var debug = require('debug')('oa:api/node/getnodesheet');
module.exports = function (req, res, api, reqBody) {cleanCallback(function* (callback){
  var return4Success = api.back4Success
  var SQLStatement = 'SELECT * FROM node'
  var result = yield dbOps(SQLStatement, callback.next)
  for(var i in result){
    if(result[i].parentnode){
      SQLStatement = 'SELECT name FROM node WHERE id = '+result[i].parentnode
      result[i].parentnode = (yield dbOps(SQLStatement, callback.next))[0].name
    }
    if(result[i].manager){
      SQLStatement = 'SELECT firstname,lastname,avatar FROM user WHERE id = '+result[i].manager
      result[i].manager = (yield dbOps(SQLStatement, callback.next))[0]
    }
  }
  return4Success(result)
})}
