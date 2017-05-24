var nodelist = new Vue({
  el: '#nodelist',
  data: {
    list:null
  }
})

function getlist() {
  nodelist.$http.get('/api/node/getnodelist').then(res => {
    nodelist.$data.list = res.body.data
  }, res => {
    modal.$data.showModal('无法获取专案详情', '因为 ' + res.body.description + '（代码：' + res.body.code + '）')
  })
}
getlist()
