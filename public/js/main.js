const socket = io.connect('http://localhost:8000');

// Initialize varibles
var $mainTitle = document.querySelector('#mainTitle');
var $sell = document.querySelector('.sell');
var $buy = document.querySelector('.buy');
var $bal = document.querySelector('.bal');
var $sellLastMinute = document.querySelector('.sellLastMinute');
var $buyLastMinute = document.querySelector('.buyLastMinute');
var $balLastMinute = document.querySelector('.balLastMinute');
var $resetSumOneMinute = document.querySelector('#resetSumOneMinute');

var last1minute = {};
last1minute.totalOrderSellMin = 0;
last1minute.totalOrderBuyMin = 0;

socket.on('updateExchangeState', function (param) {
  var datas = param.datas;
  var market = param.market;

  /*************** REAL TIME ****************/
  var totalOrderSell = 0;
  var totalOrderBuy = 0;
  console.log(datas);

  datas.forEach(function (data) {
    if (data.OrderType === 'SELL' && data.Quantity > 0 && data.Rate > 0) {
      totalOrderSell += data.Quantity * data.Rate;
      last1minute.totalOrderSellMin += totalOrderSell;
    }

    if (data.OrderType === 'BUY' && data.Quantity > 0 && data.Rate > 0) {
      totalOrderBuy += data.Quantity * data.Rate;
      last1minute.totalOrderBuyMin += totalOrderBuy;
    }
  });

  var balance = (-totalOrderSell +totalOrderBuy);

  $mainTitle.innerHTML = 'Bittrex Sum Average ' + market;
  $sell.innerHTML = (totalOrderSell !== 0) ? '- ' + totalOrderSell.toFixed(6) + ' BTC' : '-';
  $buy.innerHTML = (totalOrderBuy !== 0) ? '+ ' + totalOrderBuy.toFixed(6) + ' BTC' : '-';
  $bal.innerHTML = balance.toFixed(6) + ' BTC';

  // styles css
  if (balance > 0) {
    $bal.style.color = '#159612';
  } else {
    $bal.style.color = '#961917';
  }

  /*************** SUM LAST 1 MINUTE ****************/
  // Reset all
  $resetSumOneMinute.addEventListener('mouseup', function () {
    last1minute.totalOrderSellMin = last1minute.totalOrderBuyMin = 0;

    var totalBalanceMin = (-last1minute.totalOrderSellMin + last1minute.totalOrderBuyMin);

    $sellLastMinute.innerHTML = (last1minute.totalOrderSellMin !== 0) ? '- ' + last1minute.totalOrderSellMin.toFixed(6) + ' BTC' : '-';
    $buyLastMinute.innerHTML = (last1minute.totalOrderBuyMin !== 0) ? '+ ' + last1minute.totalOrderBuyMin.toFixed(6) + ' BTC': '-';
    $balLastMinute.innerHTML = totalBalanceMin.toFixed(6) + ' BTC'; // static val
  });

  var totalBalanceMin = (-last1minute.totalOrderSellMin + last1minute.totalOrderBuyMin);

  $sellLastMinute.innerHTML = (last1minute.totalOrderSellMin !== 0) ? '- ' + last1minute.totalOrderSellMin.toFixed(6) + ' BTC' : '-';
  $buyLastMinute.innerHTML = (last1minute.totalOrderBuyMin !== 0) ? '+ ' + last1minute.totalOrderBuyMin.toFixed(6) + ' BTC': '-';
  $balLastMinute.innerHTML = totalBalanceMin.toFixed(6) + ' BTC'; // static val

  // styles css
  if (totalBalanceMin > 0) {
    $balLastMinute.style.color = '#159612';
  } else {
    $balLastMinute.style.color = '#961917';
  }

  // just for test :
  setTimeout(function () {
    // socket.emit('updateExchangeState')
  }, 1000);

});

