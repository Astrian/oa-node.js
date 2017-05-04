moment.locale('zh-cn');
var announcementlist = new Vue({
  el: '#announcementlist',
  data:{
    announcementlist: {}
  }
})

function getAnnouncementList() {
  announcementlist.$http.get('/api/announcement/getlist').then(res => {
    res = (JSON.parse(res.bodyText)).数据
    if(res == []){console.log('null')}
    if (res[0]) {
      for (var i in res) {
        res[i].发布时间 = moment(res[i].申请时间).fromNow()
      }
      announcementlist.$data.announcementlist = res
    }
    else {
      announcementlist.$data.announcementlist = 'null'
    }
  }, res => {
    modal.$data.showModal('无法获取公告列表', '因为出现了 ' + res.body.错误描述 + ' 的错误（代码：' + res.body.错误码 + '）。')
  })
}

getAnnouncementList()