moment.locale('zh-cn');
var newuser = new Vue({
  el: '#newuser',
  data: {
    user: {
      username: "",
      mail: "",
      firstname: "",
      lastname: "",
      avatar: "",
      node: null
    },
    nodes: [],
    submit(){
      var options = {
        "Content-Type": "application/json"
      }
      this.$http.post('/api/user/newuser', newuser.$data.user, options).then(response => {
        window.location = '/user/getrecoverycode?code='+response.body.data.recovery
      }, response => {
        modal.$data.showModal('无法新建模板', '因为 ' + response.body.description + '（代码：' + res.body.code + '）。')
      });
    }
  }
})

function getnodelist() {
  newuser.$http.get('/api/node/getnodelist').then(res => {
    newuser.$data.nodes = res.body.data
  }, res => {
    modal.$data.showModal('无法获取部门列表', '因为 ' + res.body.description + '（代码：' + res.body.code + '）。')
  })
}
getnodelist()