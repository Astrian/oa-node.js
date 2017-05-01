var 调用数据库 = require('../../modules/Db').exec
var debug = require('debug')('oa: api/project/gettemplatelist');
var 回调函数是一个反人类的东西 = require('sync_back').run
var 空 = null
module.exports = function (req, res, api, 请求体) {
  回调函数是一个反人类的东西(function* (回调) {
    var 成功返回 = api.back4Success
    var 失败返回 = api.back4Fail
    if(!请求体.type || 请求体.type == '') return 失败返回(400,0,'未填写请求列表类型。')
    var 登录用户 = req.session.user
    var SQL语句
    if (请求体.type == 1) {
      SQL语句 = 'SELECT id, 标题, 描述 FROM project_temple WHERE 状态 = 1';
      var 结果 = yield 调用数据库(SQL语句, 回调.next);
      return 成功返回(结果)
    }else if (请求体.type == 2) {
      SQL语句 = 'SELECT id, 标题, 描述 FROM project_temple WHERE 创建者 = '+登录用户;
      debug(SQL语句)
      var 结果 = yield 调用数据库(SQL语句, 回调.next);
      return 成功返回(结果)
    }else{
      return 失败返回(400,1,'请求类型不正确。')
    }
  })
}