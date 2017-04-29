var 空 = null
module.exports = function (req, res, api, post) {
    var 成功返回 = api.back4Success
    if(req.session.user != null) req.session.user = null
    成功返回(空)
}