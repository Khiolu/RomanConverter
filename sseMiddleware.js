module.exports = function (req, res, next) {
  res.sseSetup = function() {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    ping(res);
  };

  res.sseSend = function(data) {
    res.write("data:"+JSON.stringify(data) + "\n\n");
  };
  next();
};

function ping(res){
  res.write(":ping"+"\n\n");
  setTimeout(ping, 1000, res);
}