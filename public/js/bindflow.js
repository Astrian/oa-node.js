var bind = new Vue({
  el: '#bind',
  data: {
    templates: [],
    choosenTemplate:null,
    nowtemplateid: null,
    getTemplateDetail() {
      bind.$http.get('/api/project/gettemplatedetail?id='+bind.$data.nowtemplateid).then(res => {
        bind.$data.choosenTemplate = res.body.data
      }, res => {
        modal.$data.showModal('无法获取模板详情', '错误是' + res.body.description + '（代码：' + res.body.code + '）')
      })
    },
    routes:[],
    flows:[],
    addRoute(){
      bind.$data.routes = (bind.$data.routes).concat([{
        judge:{
          field: 0,
          condition: null,
          value: null
        },
        flow:null
      }])
    },
    defaultRoute:{
      judge:"other",
      flow:null
    },
    defaultSwitch:false,
    submit(){
      
      var flow = bind.$data.routes
      var defaultRoute = bind.$data.defaultRoute
      if(bind.$data.defaultSwitch){
        flow = flow.concat(defaultRoute)
      }
      var data = {
        template: bind.$data.nowtemplateid,
        routes: flow
      }
      var options = {
        "Content-Type": "application/json"
      }
      console.log(data)
      this.$http.post('/api/project/bind', data, options).then(response => {
        window.location = '/project/template/detail?tip=template-submit-2&id='+bind.$data.nowtemplateid
      }, response => {
        console.log(response)
        modal.$data.showModal('无法进行绑定操作', '因为 ' + response.body.description + '（代码：' + response.body.code + '）。')
      });
    }
  }
})

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}

function onLoad() {
  bind.$http.get('/api/project/gettemplatelist?type=2').then(res => {
    console.log(res)
    bind.$data.templates = res.body.data
    if (getUrlParam('template')) {
      bind.$data.nowtemplateid = +getUrlParam('template')
      bind.$data.getTemplateDetail()
    }
  }, res => {
    modal.$data.showModal('无法获取模板列表', '错误是' + res.body.description + '（代码：' + res.body.code + '）')
  })
  bind.$http.get('/api/project/getflowlist?type=1').then(res => {
    console.log(res)
    bind.$data.flows = res.body.data
  }, res => {
    modal.$data.showModal('无法获取模板列表', '错误是' + res.body.description + '（代码：' + res.body.code + '）')
  })
}
onLoad()