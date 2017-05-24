moment.locale('zh-cn');

var projectlist = new Vue({
  el: '#projectlist',
  data: {
    panel: 1,
    projectlist: 'null',
    changepanel: function (pager) {
      changepanel(pager)
    }
  }
})

function changepanel(pager) {
  projectlist.$data.panel = pager
  getProjectList(pager)
}

function getProjectList(page) {
  user.$http.get('/api/project/getprojectlist?type=' + page).then(res => {
    res = (JSON.parse(res.bodyText)).data
    if(res == []){console.log('null')}
    if (res[0]) {
      for (var i in res) {
        res[i].submittime = moment(res[i].submittime).fromNow()
      }
      projectlist.$data.projectlist = res
    }
    else {
      projectlist.$data.projectlist = 'null'
    }
  }, res => {
    modal.$data.showModal('无法获取专案列表', '因为出现了 ' + res.body.description + ' 的错误（代码：' + res.body.code + '）。')
  })
}
getProjectList(1)
