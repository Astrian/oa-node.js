var newannouncement = new Vue({
  el: '#newannouncement',
  data: {
    preview: false,
    announcement: {
      标题: null,
      正文: null,
      范围: null,
    },
    bodypreview: null,
    triggerpreview(control) {
      newannouncement.$data.bodypreview = markdown.toHTML(newannouncement.$data.announcement.正文)
      newannouncement.$data.preview = control
    },
    postannouncement() {
      var options = {
        "Content-Type": "application/json"
      }
      var data = newannouncement.$data.announcement
      newannouncement.$http.post('/api/announcement/send', data, options).then(res => {
        window.location = '/announcement/detail?tips=announcement-post-1&id='+res.body.数据.公告ID
      }, res => {
        modal.$data.showModal('无法获取公告详情', '因为 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
      })
    }
  }
})