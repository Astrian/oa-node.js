var debug = require('debug')('oa:api/announcement/getdetail');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
var markdown = require('markdown')
var 空 = null
module.exports = function (req, res, api, reqBody) {
  cleanCallback(function* (callback) {
    var return4Success = api.back4Success
    var return4Fail = api.back4Fail
    var loginUID = req.session.user
    if (!reqBody.id || reqBody.id == '') return return4Fail(401, 0, '没有给出公告 ID。')
    var SQLStatement = 'SELECT * FROM announcements WHERE id = ' + reqBody.id
    var result = (yield dbOps(SQLStatement, callback.next))[0]
    if (!result) return return4Fail(404, 0, '请求的公告不存在，或当前user无权查看。')
    if (result.visible != -1) {
      SQLStatement = 'SELECT node FROM user WHERE id = ' + loginUID
      var node = (yield dbOps(SQLStatement, callback.next))[0].node
      if (node != result.visible) return return4Fail(404, 0, '请求的公告不存在，或当前user无权查看。')
    }
    var readlist = JSON.parse(result.readlist)
    var iAmRead = false
    if(readlist.length != 0){
      for (var i in readlist) {
        if (readlist[i].user == loginUID) {iAmRead = true}
        SQLStatement = 'SELECT firstname, lastname, avatar FROM user WHERE id = ' + readlist[i].user
        readlist[i].user = (yield dbOps(SQLStatement, callback.next))[0]
        readlist[i].time = JSON.parse(result.readlist)[i].time
      }
    }
    if (!iAmRead) {
      SQLStatement = "UPDATE announcements SET readlist  = '" + JSON.stringify([{
        user: loginUID,
        time: new Date().getTime()
      }].concat(JSON.parse(result.readlist))) + "' WHERE id = " + result.id
      yield dbOps(SQLStatement, callback.next)
      SQLStatement = 'SELECT firstname, lastname, avatar FROM user WHERE id = ' + loginUID
      readlist = [(yield dbOps(SQLStatement, callback.next))[0]].concat(readlist)
      readlist[0].time = new Date().getTime()
    }
    SQLStatement = 'SELECT firstname, lastname, avatar FROM user WHERE id = ' + result.publisher
    var publisher = (yield dbOps(SQLStatement, callback.next))[0]
    result.body = markdown.markdown.toHTML(result.body)
    result.publisher = publisher
    result.readlist = readlist
    return4Success(result)
  })
}
