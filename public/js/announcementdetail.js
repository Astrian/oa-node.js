moment.locale('zh-cn');
var announcementdetail = new Vue({
  el: '#announcementdetail',
  data: {
    detail:{}
  }
})

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}

function getannouncement(){
  var id = getUrlParam('id')
  announcementdetail.$http.get('/api/announcement/getdetail?id='+id).then(res => {
    res = (JSON.parse(res.bodyText)).data
    res.time = moment(res.time).fromNow()
    for (var i in res.readlist){
      res.readlist[i].time = moment(res.readlist[i].time).fromNow()
    }
    announcementdetail.$data.detail = res
  }, res => {
    modal.$data.showModal('无法获取公告详情', '因为 ' + res.body.description + '（代码：' + res.body.code + '）')
  })
}
getannouncement()