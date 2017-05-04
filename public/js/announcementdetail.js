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
    res = (JSON.parse(res.bodyText)).数据
    res.发布时间 = moment(res.申请时间).fromNow()
    for (var i in res.已读清单){
      console.log(res.已读清单[i].时间)
      res.已读清单[i].时间 = moment(res.已读清单[i].时间).fromNow()
    }
    announcementdetail.$data.detail = res
  }, res => {
    modal.$data.showModal('无法获取公告详情', '因为 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
  })
}
getannouncement()