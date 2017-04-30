var app = new Vue({
  el: '.vue'
})

function init() {
  app.$http.get('/api/user/signout').then(res => {
    window.location = '/'
  }, res => {
    window.location = '/'
  });
  
}
init()