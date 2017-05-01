var tipbar = new Vue({
  el:'#tip',
  data:{
    show: false,
    title: '',
    content: ''
  }
})

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}

function tip(){
  var tip = tipbar.$data
  switch(getUrlParam('tip')){
    case 'project-review-1':
      tip.show = true
      tip.title = '完成'
      tip.content = '专案已进入下一步流程。'
      break;
    case 'project-review-2':
      tip.show = true
      tip.title = '完成'
      tip.content = '专案已被打回至发布者。'
      break;
    case 'project-new-1':
      tip.show = true
      tip.title = '完成'
      tip.content = '已新建专案，可以在本页进行提交。'
      break;
    case 'project-new-2':
      tip.show = true
      tip.title = '完成'
      tip.content = '专案已成功提交。'
      break;
    case 'template-submit-1':
      tip.show = true
      tip.title = '完成'
      tip.content = '模板已发布。'
      break;
    case 'template-submit-2':
      tip.show = true
      tip.title = '完成'
      tip.content = '已新建模板，可以在本页进行发布。'
      break;
    default:
  }
}
tip()