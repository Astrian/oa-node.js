moment.locale('zh-cn');
var projectdetail = new Vue({
  el: '#projectdetail',
  data: {
    project: null,
    operate: true,
    review: function(res){
      review(res)
    },
    submit: function(){
      var data = {
        专案ID: getUrlParam('id')
      }
      var options = {
        "Content-Type": "application/json"
      }
      projectdetail.$http.post('/api/project/submitproject', data, options).then(res => {
        window.location = '/project/detail?id='+getUrlParam('id')+'&tip=project-new-2'
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
  projectdetail.$http.get('/api/project/getprojectdetail?id=' + getUrlParam('id')).then(res => {
    res.body.数据.申请时间 = moment(res.body.数据.申请时间).fromNow()
    for (i in res.body.数据.流程历史) {
      res.body.数据.流程历史[i].操作时间 = moment(res.body.数据.流程历史[i].操作时间).fromNow()
    }
    projectdetail.$data.project = res.body.数据
  }, res => {
    modal.$data.showModal('无法获取专案详情', '因为 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
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
  projectdetail.$http.post('/api/project/reviewproject', data, options).then((res) => {
    if(ops == '同意') window.location = '/project?tip=project-review-1'
    if(ops == '拒绝') window.location = '/project?tip=project-review-2'
  }, response => {
    modal.$data.showModal('无法完成相应操作', '错误是 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
  });
}