var newtemplate = new Vue({
  el: '#newtemplate',
  data: {
    templatetitle: null,
    templatedescription: null,
    fields: [],
    routes: [],
    nodes: [],
    enabledefaultroute: false,
    defaultroute: null,
    addfield: function () {
      newtemplate.$data.fields = (newtemplate.$data.fields).concat([{
        名称: null,
        描述: null,
        类型: '字段'
      }])
    },
    delfield: function (index) {
      newtemplate.$data.fields.splice(index, 1)
    },
    addroute: function () {
      newtemplate.$data.routes = (newtemplate.$data.routes).concat([{
        判断: {
          字段: 1,
          条件: null,
          基准值: null
        },
        流程: []
      }])
    },
    delroute: function (index) {
      newtemplate.$data.routes.splice(index, 1)
    },
    addstep: function (index) {
      newtemplate.routes[index].流程 = (newtemplate.routes[index].流程).concat([""])
    },
    delstep: function (i, j) {
      (newtemplate.routes[i].流程).splice(j, 1)
    },
    defaultroutetrigger() {
      if (newtemplate.$data.enabledefaultroute) {
        newtemplate.$data.defaultroute = {
          判断: "其他",
          流程: []
        }
      }
      else {
        newtemplate.$data.defaultroute = null
      }
    },
    addstepindefault: function () {
      newtemplate.$data.defaultroute.流程 = (newtemplate.$data.defaultroute.流程).concat([""])
    },
    submit() {
      var appData = newtemplate.$data
      var data = {}
      data.标题 = appData.templatetitle
      data.描述 = appData.templatedescription
      data.表单内容 = appData.fields
      data.流程 = appData.routes
      if(appData.enabledefaultroute){
        data.流程 = (data.流程).concat([appData.defaultroute])
      }
      var options = {
        "Content-Type": "application/json"
      }
      this.$http.post('/api/project/newtemplate', data, options).then(response => {
        window.location = '/project/template/detail?tip=template-submit-2&id='+response.body.数据.表单ID
      }, response => {
        modal.$data.showModal('无法新建模板', '因为 ' + response.body.错误描述 + '（代码：' + res.body.错误码 + '）。')
      });
    }
  }
})

function getnodelist() {
  newtemplate.$http.get('/api/node/getnodelist').then(res => {
    newtemplate.$data.nodes = res.body.数据
  }, res => {
    modal.$data.showModal('无法获取部门列表', '因为 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）。')
  })
}
getnodelist()