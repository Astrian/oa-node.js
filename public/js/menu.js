var menu = new Vue({
  el: '#menu',
  data: {
    getinfotomenu(obj){
      menu.$data.user = obj
    },
    user:null
  }
  
})