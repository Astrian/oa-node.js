var debug = require('debug')('oa:api/project/publishtemplate')
var db = require('../../modules/Db').exec
var sync = require('sync_back').run
module.exports = function (req, res, api, post) {
  debug('hello')
  sync(function* (back) {
    var back4Fail = api.back4Fail
    var back4Success = api.back4Success
    if (!post.temid || post.temid == '') return back4Fail(400, 0, "有必填项未填写。")
    var sql = 'SELECT 创建者 FROM project_temple WHERE id = '+post.temid
    var r = yield db(sql, back.next)
    if(r[0].状态 != 0) return back4Fail(400, 1, '目标模板不在草稿状态。')
    if(req.session.user != r[0].创建者) return back4Fail(401, 2, '当前用户不是目标模板的创建者。')
    sql = "UPDATE project_temple SET 状态 = 1 WHERE id = "+post.temid
    yield db(sql, back.next)
    back4Success(null)
  })
}