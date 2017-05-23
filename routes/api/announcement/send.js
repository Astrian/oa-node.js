var debug = require('debug')('oa:api/announcement/send');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
module.exports = function (req, res, api, reqBody) {cleanCallback(function*(callback){
  var back4Success = api.back4Success
  var back4Fail = api.back4Fail
  var loginUID = req.session.user
  if(!reqBody.visible || reqBody.visible == '') return back4Fail(400, 0, '没有指定范围')
  if(!reqBody.title || reqBody.title == '') return back4Fail(400, 0, '没有填写公告title')
  if(!reqBody.body || reqBody.body == '') return back4Fail(400, 0, '没有填写body')
  reqBody.visible = +reqBody.visible
  var SQLStatement = 'SELECT node FROM user WHERE id = '+loginUID
  debug(SQLStatement)
  var result = yield dbOps(SQLStatement, callback.next)
  debug(result)
  SQLStatement = 'SELECT * FROM node WHERE id = '+ result[0].node
  result = yield dbOps(SQLStatement, callback.next)
  var isPersonnel = false
  var isNodeManager = false
  var node
  if(result[0].manager == loginUID) {
    isNodeManager = true
    node = result[0].id
  }
  debug(result[0])
  if(result[0].ispersonnel == 1){
    isPersonnel = true
  }
  switch(reqBody.visible){
    case 1:
      if(!isNodeManager) return back4Fail(401, 1, "当前用户不是部门经理，无法发布部门公告。")
      SQLStatement = 'INSERT INTO announcements (visible, title, body, publisher, time, readlist) VALUES ('+node+', "'+reqBody.title+'", "'+reqBody.body+'", '+loginUID+', '+new Date().getTime()+',"[]")'
      var announcement = yield dbOps(SQLStatement, callback.next)
      SQLStatement = 'SELECT id FROM user WHERE node = '+node
      var notiReciver = yield dbOps(SQLStatement, callback.next)
      sendNotification(notiReciver, announcement.insertId, reqBody.title)
      back4Success({
        id: announcement.insertId
      })
      break
    case 2:
      if(!isPersonnel) return back4Fail(401, 1, "当前用户不是人事部人员，无法发布公司内部公告。")
      SQLStatement = 'INSERT INTO announcements (visible, title, body, publisher, time, readlist) VALUES (-1, "'+reqBody.title+'", "'+reqBody.body+'", '+loginUID+', '+new Date().getTime()+', "[]")'
      var announcement = yield dbOps(SQLStatement, callback.next)
      SQLStatement = 'SELECT id FROM user'
      var notiReciver = yield dbOps(SQLStatement, callback.next)
      sendNotification(notiReciver, announcement.insertId, reqBody.title)
      back4Success({
        id: announcement.insertId
      })
      break;
    default:
      return back4Fail(400, 1, "范围填写数据异常")
  }
})}

function sendNotification(notiReciver, id, title){cleanCallback(function*(callback){
  var SQLStatement
  for(var i in notiReciver){
    SQLStatement = 'INSERT INTO notification (`reciver`, `linkto`, `type`, `content`, `read`, `time`) VALUES (' + notiReciver[i].id + ', ' + id + ', "announcement", "收到一个新的公告：'+title+'", 0, '+new Date().getTime()+')'
    yield dbOps(SQLStatement, callback.next)
  }
})}
