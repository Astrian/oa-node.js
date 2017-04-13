const http = require('http');
var debug = require('debug')('app:webModule');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
//
module.exports = function (back) {
  https.createServer(function(req, res){
    var postStr = '';
    req.on('data', function (chunk) {
      postStr += chunk;
    });
    req.on('end', function () {
      var parasedUrl = url.parse(req.url, true);
      //
      var get = parasedUrl.query;
      if (postStr != '')
        var post = JSON.parse(postStr);
      var pathname = parasedUrl.pathname;
      //
      debug('请求地址：%s\n\npost 消息：\n%O\n\n收到 get 消息：\n%O', pathname, post, get);
      //
      back(pathname, get, post, function (str) {
        res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
        res.end(str);
      });
    })
  }).listen(443);
}