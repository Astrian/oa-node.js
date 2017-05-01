moment.locale('zh-cn');
var templatedetail = new Vue({
  el: '#templatedetail',
  data: {
    template: null,
    operate: true,
    review: function(res){
      review(res)
    },
    submit: function(){
      var data = {
        模板ID: getUrlParam('id')
      }
      var options = {
        "Content-Type": "application/json"
      }
      templatedetail.$http.post('/api/project/publishtemplate', data, options).then(res => {
        window.location = '/project/template/detail?id='+getUrlParam('id')+'&tip=template-submit-1'
      },res=>{
        modal.$data.showModal('无法提交专案', '错误是' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
      })
    }
  }
})

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}

function getDetail() {
  templatedetail.$http.get('/api/project/gettemplatedetail?id=' + getUrlParam('id')).then(res => {
    res.body.数据.创建时间 = moment(res.body.数据.创建时间).fromNow()
    var 流程 = res.body.数据.流程
    for (var i in 流程) {
      if(流程[i].判断 != '其他'){
        流程[i].判断.字段 = res.body.数据.表字段[流程[i].判断.字段].名称
      }
    }
    templatedetail.$data.template = res.body.数据
  }, res => {
    modal.$data.showModal('无法获取模板详情', '因为 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
  })
}
getDetail()

function review(ops) {
  var data = {
    专案ID: getUrlParam('id'),
    操作: ops
  }
  var options = {
    "Content-Type": "application/json"
  }
  templatedetail.$http.post('/api/project/reviewproject', data, options).then((res) => {
    if(ops == '同意') window.location = '/project?tip=project-review-1'
    if(ops == '拒绝') window.location = '/project?tip=project-review-2'
  }, response => {
    modal.$data.showModal('无法完成相应操作', '错误是 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
  });
}