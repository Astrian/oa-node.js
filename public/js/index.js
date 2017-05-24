var login = new Vue({
  el: '#vue',
  data: {
    username: '',
    dynamiccode: '',
    modalTitle: '',
    modalContent: '',
    login: function () {
      var options = {
        "Content-Type": "application/json"
      }
      var data = {
        username: this.username,
        code: this.dynamiccode
      }
      this.$http.post('/api/user/login', data, options).then(response => {
        window.location = '/home'
      }, response => {
        $('#modal').modal()
        this.modalTitle = '出错了'
        this.modalContent = '无法完成登录，因为'+response.body.description
      });
    }
  }
})