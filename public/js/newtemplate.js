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
        title: null,
        description: null,
        type: ''
      }])
    },
    delfield: function (index) {
      newtemplate.$data.fields.splice(index, 1)
    },
    submit() {
      var appData = newtemplate.$data
      var data = {}
      data.title = appData.templatetitle
      data.description = appData.templatedescription
      data.sheets = appData.fields
      var options = {
        "Content-Type": "application/json"
      }
      this.$http.post('/api/project/newtemplate', data, options).then(response => {
        window.location = '/project/template/detail?tip=template-submit-2&id='+response.body.data.id
      }, response => {
        console.log(response)
        modal.$data.showModal('无法新建模板', '因为 ' + response.body.description + '（代码：' + response.body.code + '）。')
      });
    }
  }
})
getnodelist()
