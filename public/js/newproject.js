moment.locale('zh-cn');
var newproject = new Vue({
  el:'#newproject',
  data:{
    choosetemplate: true,
    templates: [],
    choosedtemplate: null,
    whichtemplate: function(){
      whichtemplate()
    },
    choose_disable: null,
    fillproject: false,
    template:{},
    project_fill:[],
    submit:function(){
      var options = {
        "Content-Type": "application/json"
      }
      var data = {
        数据: newproject.$data.project_fill,
        模板ID: newproject.$data.template.id
      }
      console.log(data)
      newproject.$http.post('/api/project/newproject', data, options).then(res => {
        window.location = '/project/detail?id='+res.body.数据.专案ID+'&tip=project-new-1'
      },res=>{
        modal.$data.showModal('无法新建专案', '错误是 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
      })
    },
    back: function(){
      newproject.$data.choosetemplate = true
      newproject.$data.fillproject = false
    }
  }
})

var appData = newproject.$data

function showtemplate(){
  newproject.$http.get('/api/project/gettemplatelist?type=1').then(res => {
    appData.templates = res.body.数据
  },res=>{
    modal.$data.showModal('无法获取模板列表', '错误是 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
  })
}
showtemplate()

function whichtemplate(){
  appData.choose_disable = true
  if(!appData.choosedtemplate){
    appData.choose_disable = false
    modal.$data.showModal('还未选择模板', '需要选择一个专案模板才能继续。')
    return;
  }
  newproject.$http.get('/api/project/gettemplatedetail?id='+appData.choosedtemplate).then(res=>{
    appData.choose_disable = false
    appData.choosetemplate = false
    appData.template = res.body.数据
    appData.fillproject = true
  },res=>{
    modal.$data.showModal('无法获取模板详情', '错误是 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
  })
}