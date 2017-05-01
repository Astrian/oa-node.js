moment.locale('zh-cn');
var template = new Vue({
  el: '#template',
  data:{
    templates: {}
  }
})

var appData = template.$data

function load(){
  template.$http.get('/api/project/gettemplatelist?type=2').then(res => {
    appData.templates = res.body.数据
  },res=>{
    modal.$data.showModal('无法获取模板列表', '错误是 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
  })
}
load()