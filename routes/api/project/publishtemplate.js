var debug = require('debug')('oa:api/project/publishtemplate')
var 调用数据库 = require('../../modules/Db').exec
var 回调函数是一个反人类的东西 = require('sync_back').run
module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西(function* (回调) {
    var 当前登录用户 = req.session.user
    var 失败返回 = api.back4Fail
    var 成功返回 = api.back4Success
    if (!请求体.模板ID || 请求体.模板ID == '') return 失败返回(400, 0, "模板 ID 未填写。")
    var SQL语句 = 'SELECT 创建者,状态 FROM project_temple WHERE id = '+请求体.模板ID
    var 调用结果 = yield 调用数据库(SQL语句, 回调.next)
    if(!调用结果[0]) return 失败返回(404, 0, '模板不存在')
    if(调用结果[0].状态 != 0) return 失败返回(400, 1, '目标模板不在草稿状态。')
    if(当前登录用户 != 调用结果[0].创建者) return 失败返回(401, 2, '当前用户不是目标模板的创建者。')
    SQL语句 = "UPDATE project_temple SET 状态 = 1 WHERE id = "+请求体.模板ID
    yield 调用数据库(SQL语句, 回调.next)
    成功返回(null)
  })
}
