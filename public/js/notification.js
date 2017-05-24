moment.locale('zh-cn');
var notification = new Vue({
  el: '.notification',
  data:{
    notification: null
  }
})

function getNotification(){
  user.$http.get('/api/notification/getnotification').then(res => {
    res = (JSON.parse(res.bodyText)).data
    for(var i in res){
      res[i].time = moment(res[i].time, 'x').fromNow()
      notification.$data.notification = res
    }
  },res=>{
    modal.$data.showModal('无法获取通知','因为出现了 '+res.body.description+' 的错误（代码：'+res.body.code+'）。')
  })
}
getNotification();