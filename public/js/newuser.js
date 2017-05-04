moment.locale('zh-cn');
var newuser = new Vue({
  el: '#newuser',
  data: {
    user: {
      用户名: "",
      邮箱: "",
      姓: "",
      名: "",
      所属部门: null
    },
    nodes: [],
    submit(){
      var options = {
        "Content-Type": "application/json"
      }
      this.$http.post('/api/user/newuser', newuser.$data.user, options).then(response => {
        window.location = '/user/getrecoverycode?code='+response.body.数据.临时登录密钥
      }, response => {
        modal.$data.showModal('无法新建模板', '因为 ' + response.body.错误描述 + '（代码：' + res.body.错误码 + '）。')
      });
    }
  }
})

function getnodelist() {
  newuser.$http.get('/api/node/getnodelist').then(res => {
    newuser.$data.nodes = res.body.数据
  }, res => {
    modal.$data.showModal('无法获取部门列表', '因为 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）。')
  })
}
getnodelist()