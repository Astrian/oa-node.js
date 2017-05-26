var newflow = new Vue({
  el: '#newflow',
  data: {
    flow: {
      title: "",
      description: "",
      flow: []
    },
    users: [],
    deleteFlowStep(index){
      newflow.$data.flow.flow.splice(index, 1)
    },
    submit(){
      var appData = newflow.$data
      var data = {}
      data.title = appData.flow.title
      data.description = appData.flow.description
      data.flow = appData.flow.flow
      var options = {
        "Content-Type": "application/json"
      }
      newflow.$http.post('/api/project/newflow', data, options).then(response => {
        window.location = '/project/flow/detail?tip=flow-submit-1&id='+response.body.data.id
      }, response => {
        console.log(response)
        modal.$data.showModal('无法新建模板', '因为 ' + response.body.description + '（代码：' + response.body.code + '）。')
      });
    }
  }
})

function addFlowStep(){
  newflow.$data.flow.flow = newflow.$data.flow.flow.concat([0])
}

function onLoad(){
  newflow.$http.get('/api/user/getlist').then(res => {
    newflow.$data.users = res.body.data
  }, res=>{})
}
onLoad()
