moment.locale('zh-cn');
var template = new Vue({
  el: '#template',
  data:{
    templates: {}
  }
})

var appData = template.$data

function load(){
  template.$http.get('/api/project/getflowlist?type=2').then(res => {
    appData.templates = res.body.data
  },res=>{
    modal.$data.showModal('无法获取流程列表', '错误是 ' + res.body.description + '（代码：' + res.body.code + '）')
  })
}
load()
