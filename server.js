const bodyParser = require('body-parser'),
  express = require('express'),
  properties = {
  port : 2225,
  timeout : 5000,
  url: 'http://localhost'
}, romanNumbers = [
  ['I',1],
  ['IV',4],
  ['V',5],
  ['IX',9],
  ['X',10],
  ['XL',40],
  ['IL',49],
  ['L',50],
  ['XC',90],
  ['IC',99],
  ['C',100],
  ['XD',400],
  ['ID',499],
  ['D',500],
  ['CM',900],
  ['XM',990],
  ['IM',999],
  ['M',1000]
];

var app = express();
let connections = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname );
app.set('view engine', 'pug');
app.use(require('./sseMiddleware'));
app.use(express.static('./'));

app.get('/',(req, res, next)=>{ 
  res.send('index.html');
});
app.post('/',(req, res, next)=>{
  if(req.body.id && req.body.id>=0){
    connections[req.body.id].sseSend({result:conversionChiffreRomain(Number.parseInt(req.body.chiffre))});
  }else{
    res.status(400).send('Bad Request<br>Missing Id');
  }
});
app.get('/sse',(req, res, next)=>{
  res.sseSetup();
  res.sseSend({id:connections.length});
  connections.push(res);
});

var server = app.listen(properties.port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("Server started. Open up %s:%s/ in your browser.", properties.url, properties.port);
  }
});
server.timeout = properties.timeout;

function conversionChiffreRomain(chiffre) {
  if(!isNaN(chiffre) && chiffre > 0 && Number.isInteger(chiffre)){
    function traitementRecursif(chiffre){
      for (var i = romanNumbers.length - 1; i >= 0; i--) {
        let [romanNumber,number] = romanNumbers[i];
        let chiffreResult = chiffre-number;
        if(chiffreResult >= 0){
          result+=romanNumber;
          traitementRecursif(chiffreResult);
          break;
        }else if(chiffreResult == 0){
          result+=romanNumber;
        } 
      }
    }
    let result="";
    traitementRecursif(chiffre);
    return result; 
  }else{
    return NaN;
  }
}