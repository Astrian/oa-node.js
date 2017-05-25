moment.locale('zh-cn');
var flowdetail = new Vue({
  el: '#flowdetail',
  data:{
    flow:{}
  }
})

function getDetail() {
  flowdetail.$http.get('/api/project/getflowdetail?id=' + getUrlParam('id')).then(res => {
    flowdetail.$data.flow = res.body.data
  }, res => {
    modal.$data.showModal('无法获取专案详情', '因为 ' + res.body.description + '（代码：' + res.body.code + '）')
  })
}
getDetail()

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}
