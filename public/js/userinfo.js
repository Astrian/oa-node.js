var user = new Vue({
  el: '#user',
  data: {
    modalTitle: '',
    modalContent: '',
    user:{}
  }
})

function getuserinfo() {
  console.log(modal)
  user.$http.get('/api/user/getinfo').then(res => {
    var userinfo = JSON.parse(res.bodyText)
    user.$data.user = userinfo.数据
  }, res => {
    modal.$data.showModal('无法获取用户数据','因为出现了 '+res.body.错误描述+' 的错误（代码：'+res.body.错误码+'）。')
  });
  
}
getuserinfo()