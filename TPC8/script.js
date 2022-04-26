$(function () {
  $.get('http://localhost:7709/paras', data => {
    data.forEach(p => {
      $('#list').append('<li>' + p.text + '</li>')
    });
  })


  $("#addPara").click(function () {
    event.preventDefault();
    let text = $('#paraText').val();
    if (text != '') {
      $("#list").append('<li>' + text + '</li>')
      $.post('http://localhost:7709/paras', $('#myParaForm').serialize())
      alert('Record inserted: ' + JSON.stringify($('#myParaForm').serialize()))
    }
    $('#paraText').val('')
  });
});