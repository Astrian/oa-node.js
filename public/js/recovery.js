var recovery = new Vue({
  el: '.loginmodal',
  data:{
    step: 1,
    username: "",
    code: "",
    qrcode: '',
    authcode: '',
    submitstep1(){
      var options = {
        "Content-Type": "application/json"
      }
      var data = {
        username: recovery.$data.username,
        recovery: recovery.$data.code
      }
      recovery.$http.post('/api/user/recovery', data, options).then(res => {
        recovery.$data.step = 2
        recovery.$data.qrcode = (res.body.data.qrcode).replace(/&/g, "%26")
        console.log(recovery.$data.qrcode)
      },res=>{
        modal.$data.showModal('无法完成操作', '因为 ' + res.body.description + '（代码：' + res.body.code + '）')
      })
    },
    submitstep2(){
      var options = {
        "Content-Type": "application/json"
      }
      var data = {
        username: recovery.$data.username,
        recovery: recovery.$data.code,
        code: recovery.$data.authcode
      }
      recovery.$http.post('/api/user/confirmtoken', data, options).then(res => {
        window.location = '/home'
      },res=>{
        modal.$data.showModal('无法完成操作', '因为 ' + res.body.description + '（代码：' + res.body.code + '）')
      })
    }
  }
})
