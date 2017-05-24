var newannouncement = new Vue({
  el: '#newannouncement',
  data: {
    preview: false,
    announcement: {
      title: null,
      body: "",
      visible: null
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
        window.location = '/announcement/detail?tips=announcement-post-1&id='+res.body.data.id
      }, res => {
        modal.$data.showModal('无法发布公告', '因为 ' + res.body.description + '（代码：' + res.body.code + '）')
      })
    }
  }
})