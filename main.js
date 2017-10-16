var evtSource = new EventSource("/sse");
var id = -1;
evtSource.onmessage = function(e) {
  let data = JSON.parse(e.data);
  if(data.id || data.id == 0){
   id = data.id;
  }else if(data.result){
    $("#resultHolder").show();
    $("#result").text(data.result);
  }else{
    console.error("EventSource error.");
    console.error(e);
  }
};
evtSource.onerror = function(e) {
  console.error("EventSource failed.");
  console.error(e);
};
$('#form').on('submit', function (event) {
    event.preventDefault(); // Stop the form from causing a page refresh.
    var data = {
      chiffre: $('#chiffre').val(),
      id:id
    };
    $.ajax({
      url: '/',
      data: data,
      method: 'POST'
    }).then(function (response) {}).catch(function (err) {
      console.error(err);
    });
  });