var user = new Vue({
  el: '#user',
  data: {
    modalTitle: '',
    modalContent: '',
    user:{},
    userinfo:""
  }
})

function getuserinfo() {
  console.log(modal)
  user.$http.get('/api/user/getinfo').then(res => {
    var userinfo = JSON.parse(res.bodyText)
    user.$data.user = userinfo.data
    menu.$data.getinfotomenu(userinfo.data)
    user.$data.userinfo = "<div class='website-title'><a href='/'><span class='website-name'>企业自动化办公系统</span></a></div><div class='dropdown userinfo pull-right'><image class='avatar img-circle' src='"+userinfo.data.avatar+"'>&nbsp; <a id='usermenu' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true' href>"+userinfo.data.firstname+userinfo.data.lastname+"&nbsp;<span class='caret'></span></a><ul class='dropdown-menu' aria-labelledby='usermenu'><li><a href='/signout'>退出登录</a></li></ul></div>"
  }, res => {
    modal.$data.showModal('无法获取用户数据','因为出现了 '+res.body.description+' 的错误（代码：'+res.body.code+'）。')
  });
  
}
getuserinfo()