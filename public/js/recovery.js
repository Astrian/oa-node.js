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
        用户名: recovery.$data.username,
        恢复密钥: recovery.$data.code
      }
      recovery.$http.post('/api/user/recovery', data, options).then(res => {
        recovery.$data.step = 2
        recovery.$data.qrcode = (res.body.数据.二维码).replace(/&/g, "%26")
        console.log(recovery.$data.qrcode)
      },res=>{
        modal.$data.showModal('无法完成操作', '因为 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
      })
    },
    submitstep2(){
      var options = {
        "Content-Type": "application/json"
      }
      var data = {
        用户名: recovery.$data.username,
        恢复密钥: recovery.$data.code,
        动态验证码: recovery.$data.authcode
      }
      recovery.$http.post('/api/user/recovery', data, options).then(res => {
        window.location = '/home'
      },res=>{
        modal.$data.showModal('无法完成操作', '因为 ' + res.body.错误描述 + '（代码：' + res.body.错误码 + '）')
      })
    }
  }
})
