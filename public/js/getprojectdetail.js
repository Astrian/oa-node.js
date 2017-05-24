moment.locale('zh-cn');
var projectdetail = new Vue({
  el: '#projectdetail',
  data: {
    next: "",
    state: "",
    showreviewops: 0,
    project: null,
    operate: true,
    review: function(res){
      review(res)
    },
    submit: function(){
      var data = {
        project: getUrlParam('id')
      }
      var options = {
        "Content-Type": "application/json"
      }
      projectdetail.$http.post('/api/project/submitproject', data, options).then(res => {
        window.location = '/project/detail?id='+getUrlParam('id')+'&tip=project-new-2'
      },res=>{
        modal.$data.showModal('无法提交专案', '错误是' + res.body.description + '（代码：' + res.body.code + '）')
      })
    },
    gotoview(view){
      projectdetail.$data.showreviewops = view
    },
    nodes:[]
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
    res.body.data.submittime = moment(res.body.data.submittime).fromNow()
    for (i in res.body.data.history) {
      res.body.data.history[i].time = moment(res.body.data.history[i].time).fromNow()
    }
    console.log(res.body.data)
    projectdetail.$data.project = res.body.data
  }, res => {
    modal.$data.showModal('无法获取专案详情', '因为 ' + res.body.description + '（代码：' + res.body.code + '）')
  })
}
getDetail()

function review(ops) {
  var data = {
    project: getUrlParam('id'),
    operation: ops,
    next: projectdetail.$data.next,
    note: projectdetail.$data.state
  }
  var options = {
    "Content-Type": "application/json"
  }
  projectdetail.$http.post('/api/project/reviewproject', data, options).then((res) => {
    if(ops == 'pass') window.location = '/project?tip=project-review-1'
    if(ops == 'refuse') window.location = '/project?tip=project-review-2'
  }, res => {
    if(res.status == 409){
      projectdetail.$data.gotoview(2)
    }else{
      modal.$data.showModal('无法完成相应操作', '错误是 ' + res.body.description + '（代码：' + res.body.code + '）')
    }
  });
}

function getnodelist() {
  projectdetail.$http.get('/api/user/getlist').then(res => {
    projectdetail.$data.nodes = res.body.data
  }, res => {
    modal.$data.showModal('无法获取用户列表', '因为 ' + res.body.description + '（代码：' + res.body.code + '）。')
  })
}
getnodelist()
