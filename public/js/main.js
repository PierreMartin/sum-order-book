const socket = io.connect('http://localhost:8000');

// Initialize varibles
var $mainTitle = document.querySelector('#mainTitle');
var $test0 = document.querySelector('.test0');
var $test1 = document.querySelector('.test1');
var $test2 = document.querySelector('.test2');



socket.on('updateExchangeState', function (param) {
  var datas = param.datas;
  var market = param.market;
  var totalOrderSell = 0;
  var totalOrderBuy = 0;
  console.log(datas);

  datas.forEach(function (data) {
    if (data.OrderType === 'SELL' && data.Quantity > 0 && data.Rate > 0) {
      totalOrderSell += data.Quantity * data.Rate;
    }

    if (data.OrderType === 'BUY' && data.Quantity > 0 && data.Rate > 0) {
      totalOrderBuy += data.Quantity * data.Rate;
    }
  });

  var balance = (-totalOrderSell +totalOrderBuy);

  $mainTitle.innerHTML = 'Bittrex Sum Average ' + market;
  $test0.innerHTML = (totalOrderSell !== 0) ? '-' + totalOrderSell.toFixed(6) + ' BTC' : '0';
  $test1.innerHTML = (totalOrderBuy !== 0) ? '+' + totalOrderBuy.toFixed(6) + ' BTC' : '0';
  $test2.innerHTML = balance.toFixed(6) + ' BTC';

  if (balance > 0) {
    $test2.style.color = '#159612';
  } else {
    $test2.style.color = '#961917';
  }


  // just for test :
  setTimeout(function () {
    // socket.emit('updateExchangeState')
  }, 1000);

});
