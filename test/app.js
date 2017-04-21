var assert = require('assert');
var run = require('sync_back').run;
var request = require('request');

var Url = 'http://127.0.0.1:3000/';
var cookie = '';

var post = function(url, data, back) {
    request.post({
        url: url,
        form: JSON.stringify(data),
        headers: {
            'cookie': cookie
        }
    }, function(err, data) {
        var cookie = data.headers['set-cookie'][0]
        if (err)
            back(err)
        data = data.body
        back(err, JSON.parse(data))
    });
}

describe('专案系统', function() {
    it('登录', function(done) {
        post(Url + 'api/login', {}, function(err, data) {
            if (err)
                console.log(err)

            done()
        })
    })
    it('新建专案模板', function(done) {
        run(function*(api) {
            var data = yield post(Url + 'api/project/newtemplate', {
                "title": "test",
                "description": "测试",
                "form": [{
                    "name": "请假时间",
                    "description": "以天计算的请假时间",
                    "type": "int"
                }, {
                    "name": "请假事由",
                    "description": "填写请假事由",
                    "type": "text"
                }],
                "flow": [{
                    "condition": [{
                        "opsdata": 0,
                        "condite": ">",
                        "data": '3'
                    }],
                    "flow": ['开发部', '总经办', '人事部']
                }, {
                    "condition": "other",
                    "flow": ['开发部', '人事部']
                }]
            }, api.next);
            if (api.err)
                console.log(api.err)
            console.log(data)
            assert(data.status == "Success");

            done();
        })
    });
});