moment.locale('zh-cn');
var projectdetail = new Vue({
  el:'#newtemplate',
  data:{
    choosetemplate: true
  }
})

function showtemplate(){
  projectdetail.$http.get('/api/project/gettemplatelist?type=1').then(res => {
    projectdetail.$data.templates = res.body.数据
  },res=>{
    modal.$data.showModal('无法完成相应操作', '错误是 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
  })
}
showtemplate()