var app = new Vue({
  el: '#vue',
  data: {
    modalTitle: '',
    modalContent: '',
    username: '',
    avatar:''
  },
  setprofile: function (name) {
    this.setData({
      username: name
    })
  }
})

function init() {
  app.$http.get('/api/user/getinfo').then(res => {
    var userinfo = JSON.parse(res.bodyText)
    console.log(userinfo)
    app.$data.username = (userinfo.数据.姓).concat(userinfo.数据.名)
    app.$data.avatar = userinfo.数据.头像
  }, res => {
    $('#modal').modal()
    this.modalTitle = '出错了'
    this.modalContent = '无法获取用户数据，因为' + res.body.错误描述
  });
  
}
init()