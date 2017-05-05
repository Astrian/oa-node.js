var nodelist = new Vue({
  el: '#nodelist',
  data: {
    list:null
  }
})

function getlist() {
  nodelist.$http.get('/api/node/getnodesheet').then(res => {
    nodelist.$data.list = res.body.数据
  }, res => {
    modal.$data.showModal('无法获取专案详情', '因为 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
  })
}
getlist()