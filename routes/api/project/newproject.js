var debug = require('debug')('oa: api/project/newtemplate');
var dbOps = require('../../modules/Db').exec
var cleanCallback = require('sync_back').run
var typeJudger = require('util')
var 空 = null

module.exports = function (req, res, api, reqBody) {cleanCallback (function *(callback){
  var return4Fail = api.back4Fail
  var return4Success = api.back4Success
  var loginUID = req.session.user
  if(!reqBody.template || reqBody.template == '') return return4Fail(400, 3, '未填写模板 ID。')
  if(!reqBody.data || reqBody.data == '') return return4Fail(400, 3, '无数据。')
  var SQLStatement = 'SELECT * FROM project_temple WHERE status = 1 AND id = '+reqBody.template
  var result = yield dbOps(SQLStatement, callback.next)
  if(!result[0]) return return4Fail(404,1,'模板不存在（ID 错误），或尚未发布。')
  var forms = JSON.parse(result[0].sheets)
  var data = reqBody.data
  if(forms.length != data.length) return return4Fail(400, 0, '字段不完整。')
  for(var i in forms){
    switch(forms[i].type){
      case 'string':
        if(!typeJudger.isString(data[i])) return4Fail(400,1,'第 '+((+i)+1)+ ' 位数据应该是一个字符串，但它是一个数字。')
        break
      case 'text':
        if(!typeJudger.isString(data[i])) return4Fail(400,1,'第 '+((+i)+1)+ ' 位数据应该是一个文本，但它是一个数字。')
        break
      case 'number':
        if(!typeJudger.isNumber(data[i])) return4Fail(400,1,'第 '+((+i)+1)+ ' 位数据应该是一个文本，但它是一个数字。')
    }
  }
  SQLStatement = "INSERT INTO project (applyer, submittime, template, data, status) VALUES ('"+loginUID+"', '"+new Date().getTime()+"','"+reqBody.template+"','"+JSON.stringify(reqBody.data)+"', -1)"
  result = yield dbOps(SQLStatement, callback.next)
  return4Success({
    id: result.insertId
  })
})}
