var modal = new Vue({
  el: '#modal',
  data: {
    modalTitle: '',
    modalContent: '',
    showModal: function(title, content){
      this.modalTitle = title
      this.modalContent = content
      $('#modal').modal()
    }
  }
})
