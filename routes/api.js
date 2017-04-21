var express = require('express');
var router = express.Router();
//var sql = require('../../modules/sql');
var debug = require('debug')('app:newtemplate');
var util = require('util')
var Db = require('./modules/Db')
var sync = require('sync_back').run

router.post('/login', function(req, res, next) {
    var post = req.body

    run(req, res, {
        'login': false
    }, function(api) {
        var back4Fail = api.back4Fail
        var back4Success = api.back4Success

        req.session.user = 0
        return back4Success(null)
    })
})

router.post('/project/newtemplate', function(req, res, next) {
    var post = req.body

    run(req, res, {}, function(api) {
        var back4Fail = api.back4Fail
        var back4Success = api.back4Success

        if (!post.title || post.title == '' || !post.description || post.description == '' || !post.form || !post.flow)
            return back4Fail(400, 0, "有必填项未填写。")

        var flow = post.flow;
        for (var i in flow) {
            if (!flow[i] || flow[i] == '')
                return back4Fail(400, 3, "流程不完整。")
            var conditionTOF = true
            if (util.isArray(flow[i].condition)) {
                debug('数组')
                for (var k in flow[i].condition) {
                    if (false) { // 判断 condition 内元素是否正确
                        conditionTOF = false
                    }
                }
            } else {
                debug('字符串')
                if (flow[i].condition != "other")
                    conditionTOF = false
            }
            if (!conditionTOF) {
                back4Fail(400, 4, "字段有错误。")
                return;
            }
        }

        var form = post.form
        for (var j in form) {
            if (!form[i] || form[i] == '')
                return back4Fail(400, 3, "流程不完整。")
        }
        // 缺权限检查、登录检查
        if (!post.permission || post.permission == '') {
            post.permission = 0
        }
        //sql.exec("INSERT INTO projecttemple (name, description, permission, opsflow, uid, status) VALUES ('" + post.name + "', '" + post.description + "','" + post.permission + "', '" + JSON.stringify(post.opsflow) + "', 0, 0 )")
        back4Success(null)
    })
});

function run(req, res, opt, fun) {
    sync(function*(api) {
        var needLogin = opt.login != null ? opt.login : true
        var needDb = opt.db != null ? opt.db : true

        if (needLogin && req.session.user == null)
            return failBack(401, 0, "未登录至系统。")

        var api = {}
        if (needDb)
            api.dbExec = function(sql, back) {
                Db.exec(sql, back)
            }

        api.back4Success = successBack
        api.back4Fail = failBack

        fun(api)

        function successBack(data) {
            var json = {}

            json.status = 'Success'
            if (data != null)
                json.data = data

            res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
            res.end(JSON.stringify(json));
        }

        function failBack(httpCode, code, des) {
            var json = {}

            json.status = 'Fail'
            json.code = code
            json.description = des

            res.writeHead(httpCode, { 'Content-Type': 'application/json;charset=utf-8' });
            res.end(JSON.stringify(json));
        }
    })
}

module.exports = router;