moment.locale('zh-cn');
var userlist = new Vue({
  el: '#userlist',
  data: {
    list: []
  }
})
function getuserlist(){
  user.$http.get('/api/user/getlist').then(res => {
    userlist.$data.list = res.body.data
  }, res=>{})
}
getuserlist()