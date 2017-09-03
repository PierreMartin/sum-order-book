const socket = io.connect('http://localhost:8000');

// Initialize variables
var $mainTitle = document.querySelector('#mainTitle');
var $sell = document.querySelector('.sell');
var $buy = document.querySelector('.buy');
var $bal = document.querySelector('.bal');
var $sellCumulate = document.querySelector('.sellLastMinute');
var $buyCumulate = document.querySelector('.buyLastMinute');
var $balCumulate = document.querySelector('.balLastMinute');
var $resetCumulate = document.querySelector('#resetSumOneMinute');
var $balContainerRealtime = document.querySelector('.bal-container-realtime');
var $balContainerCumulate = document.querySelector('.bal-container-cumulate');

var cumulate = {};
cumulate.totalOrderSell = 0;
cumulate.totalOrderBuy = 0;

/**
 * @param {String} balanceValue - the current value
 * @param {Element} element - element html target
 * @return {void}
 * */
function addStyle(balanceValue, element) {
  if (balanceValue > 0) {
    element.classList.add('change-positive');
    element.classList.remove('change-negative');
  } else if (balanceValue < 0) {
    element.classList.add('change-negative');
    element.classList.remove('change-positive');
  } else {
    element.classList.remove('change-negative');
    element.classList.remove('change-positive');
  }

  if (element === $balContainerRealtime) {
    setTimeout(function () {
      element.classList.remove('change-negative');
      element.classList.remove('change-positive');
    }, 600);
  }

}

/**
 * display the real time datas
 *
 * @param {Array} datas - the datas from API Bittrex
 * @param {String} market - the currency watching
 * @return {void}
 * */
function showRealTime(datas, market) {
  var orderSell = 0; // in btc
  var orderBuy = 0; // in btc

  datas.forEach(function (data) {
    if (data.OrderType === 'SELL' && data.Quantity > 0 && data.Rate > 0) {
      orderSell += data.Quantity * data.Rate;
      cumulate.totalOrderSell += orderSell;
    }

    if (data.OrderType === 'BUY' && data.Quantity > 0 && data.Rate > 0) {
      orderBuy += data.Quantity * data.Rate;
      cumulate.totalOrderBuy += orderBuy;
    }
  });

  var balance = (-orderSell +orderBuy);

  $mainTitle.innerHTML = 'Bittrex Sum Average ' + market;
  $sell.innerHTML = (orderSell !== 0) ? '- ' + orderSell.toFixed(6) + ' BTC' : '-';
  $buy.innerHTML = (orderBuy !== 0) ? '+ ' + orderBuy.toFixed(6) + ' BTC' : '-';
  $bal.innerHTML = balance.toFixed(6) + ' BTC';

  // styles css
  addStyle(balance, $balContainerRealtime);
}

/**
 * display the cumulate datas based on the real time
 *
 * @return {void}
 * */
function showCumulate() {
  // Reset all at the action
  $resetCumulate.addEventListener('mouseup', function () {
    cumulate.totalOrderSell = cumulate.totalOrderBuy = 0;

    var totalBalance = (-cumulate.totalOrderSell + cumulate.totalOrderBuy);

    $sellCumulate.innerHTML = '-';
    $buyCumulate.innerHTML = '-';
    $balCumulate.innerHTML = totalBalance.toFixed(6) + ' BTC';
    addStyle(0, $balContainerCumulate);
  });

  var totalBalance = (-cumulate.totalOrderSell + cumulate.totalOrderBuy);

  $sellCumulate.innerHTML = (cumulate.totalOrderSell !== 0) ? '- ' + cumulate.totalOrderSell.toFixed(6) + ' BTC' : '-';
  $buyCumulate.innerHTML = (cumulate.totalOrderBuy !== 0) ? '+ ' + cumulate.totalOrderBuy.toFixed(6) + ' BTC': '-';
  $balCumulate.innerHTML = totalBalance.toFixed(6) + ' BTC'; // static val

  // styles css
  addStyle(totalBalance, $balContainerCumulate);
}

/**
 * receive the socket
 *
 * @return {void}
 * */
socket.on('updateExchangeState', function (param) {
  var datas = param.datas;
  var market = param.market;
  console.log(datas);

  showRealTime(datas, market);
  showCumulate();

  /*
  setTimeout(function () {
    socket.emit('orderbook');
  }, 1000);
  */

});


