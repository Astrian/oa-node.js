moment.locale('zh-cn');
var notification = new Vue({
  el: '.notification',
  data:{
    notification: null
  }
})

function getNotification(){
  user.$http.get('/api/notification/getnotification').then(res => {
    res = (JSON.parse(res.bodyText)).数据
    for(var i in res){
      switch(res[i].类型){
        case '专案':
          res[i].类型 = 'project'
          break;
        case '公告':
          res[i].类型 = 'announcement'
          break;
      }
      res[i].发送时间 = moment(res[i].发送时间, 'x').fromNow()
      notification.$data.notification = res
    }
  },res=>{
    modal.$data.showModal('无法获取通知','因为出现了 '+res.body.错误描述+' 的错误（代码：'+res.body.错误码+'）。')
  })
}
getNotification();