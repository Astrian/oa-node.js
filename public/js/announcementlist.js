moment.locale('zh-cn');
var announcementlist = new Vue({
  el: '#announcementlist',
  data:{
    announcementlist: {}
  }
})

function getAnnouncementList() {
  announcementlist.$http.get('/api/announcement/getlist').then(res => {
    res = (JSON.parse(res.bodyText)).data
    if(res == []){console.log('null')}
    if (res[0]) {
      for (var i in res) {
        res[i].time = moment(res[i].time).fromNow()
      }
      announcementlist.$data.announcementlist = res
    }
    else {
      announcementlist.$data.announcementlist = 'null'
    }
  }, res => {
    modal.$data.showModal('无法获取公告列表', '因为出现了 ' + res.body.description + ' 的错误（代码：' + res.body.code + '）。')
  })
}

getAnnouncementList()