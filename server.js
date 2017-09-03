var express       = require('express');
var app           = express();
var server        = require('http').Server(app);
var io            = require('socket.io')(server);
var bittrex       = require('node.bittrex.api');

var port          = process.env.PORT || 8000;
const API_KEY     = '';
const API_SECRET  = '';
const market      = 'NEO'; // <== Here set the currency to watch

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

/***********
 * CONFIG BITTREX
 * *********/
bittrex.options({
  'apikey' : API_KEY,
  'apisecret' : API_SECRET,
  'stream' : true,
  'verbose' : true,
  'cleartext' : false
});


/***********
 * DATA
 * *********/
io.on('connection', function (socket) {

  // new oders
  bittrex.websockets.subscribe(['BTC-' + market], function(data) {
    if (data.M === 'updateExchangeState') {
      // only accomplished oders :
      if (data.A[0].Fills.length > 0) {
        socket.emit('updateExchangeState', {datas: data.A[0].Fills, market: market});
      }
    }
  });


  // faire un .sort() sur le 'Rate' et  (rate * quantity = total) et (total + row = SUM)
  /*
  bittrex.getorderbook({ market : 'BTC-LTC', depth : 10, type : 'both' }, function( data, err ) {
    socket.emit('orderbook', data);
  });
  */

});


server.listen(port, function () {
  console.log('✔ Server listening at port %d', port);
});
