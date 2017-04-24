var Db = require('../../modules/Db')
var debug = require('debug')('oa: api/project/newtemplate');
var sync = require('sync_back').run
var util = require('util')
module.exports = function (req, res, api, post) {
  sync(function* (back) {
    var back4Fail = api.back4Fail
    var back4Success = api.back4Success
    debug(post)
    if (!post.title || post.title == '') return back4Fail(400, 0, "标题未填写。")
    if ( !post.description || post.description == '') return back4Fail(400, 0, "描述未填写。")
    if (!post.form) return back4Fail(400, 0, "缺少字段。")
    if (!post.flow) return back4Fail(400, 0, "缺少流程。")
    var flow = post.flow;
    for (var i in flow) {
      if (!flow[i] || flow[i] == '') return back4Fail(400, 3, "流程不完整。")
      var conditionTOF = true
      if (util.isArray(flow[i].condition)) {
        debug('数组')
        for (var k in flow[i].condition) {
          if (false) { // 判断 condition 内元素是否正确
            conditionTOF = false
          }
        }
      }
      else {
        debug('字符串')
        if (flow[i].condition != "other") conditionTOF = false
      }
      if (!conditionTOF) {
        back4Fail(400, 4, "字段有错误。")
        return;
      }
    }
    var form = post.form
    for (var j in form) {
      if (!form[i] || form[i] == '') return back4Fail(400, 3, "流程不完整。")
    }
    var sql = "INSERT INTO project_temple (标题, 描述, 表字段, 流程, 状态, 创建者, 创建时间) VALUES ('" + post.title + "', '" + post.description + "','" + JSON.stringify(post.form) + "', '" + JSON.stringify(post.flow) + "', 0, "+req.session.user+", " + new Date().getTime() + " )";
    var r = yield Db.exec(sql, back.next)
    back4Success({
      temid: r.insertId
    })
  })
}