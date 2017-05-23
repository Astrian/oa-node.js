module.exports = function (req, res, api, post) {
    var return4Success = api.back4Success
    req.session.user = null
    return4Success(null)
}
