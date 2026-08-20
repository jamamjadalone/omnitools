(function () {
  "use strict";
  var RATES = {
    "USD":1,"EUR":0.92,"GBP":0.79,"JPY":149.5,"CAD":1.36,"AUD":1.53,"CHF":0.88,
    "CNY":7.24,"INR":83.12,"MXN":17.15,"BRL":4.97,"KRW":1328.5,"SGD":1.34,
    "HKD":7.82,"NOK":10.58,"SEK":10.42,"DKK":6.87,"PLN":4.03,"CZK":22.54,
    "HUF":352.6,"TRY":28.92,"RUB":91.5,"ZAR":18.92,"NZD":1.64,"THB":35.2,
    "IDR":15438,"PHP":56.08,"MYR":4.68,"TWD":31.45,"SAR":3.75,"AED":3.67,
    "EGP":30.9,"NGN":785,"KES":153.2,"ARS":350,"CLP":880,"COP":3950,
    "PEN":3.72,"VND":24350,"BDT":110.5,"PKR":285.6,"LKR":312,"KHR":4080,
    "ISK":137.2,"HRK":6.94,"RON":4.57,"BGN":1.8,"RSD":108.5,"UAN":37.8,
    "GEL":2.65,"AZN":1.7,"KZT":462,"UZS":12250,"BHD":0.376,"JOD":0.709,
    "KWD":0.308,"OMR":0.385,"QAR":3.64,"SDD":0.376
  };
  var CURRENCY_NAMES = {
    "USD":"US Dollar","EUR":"Euro","GBP":"British Pound","JPY":"Japanese Yen",
    "CAD":"Canadian Dollar","AUD":"Australian Dollar","CHF":"Swiss Franc",
    "CNY":"Chinese Yuan","INR":"Indian Rupee","MXN":"Mexican Peso","BRL":"Brazilian Real",
    "KRW":"South Korean Won","SGD":"Singapore Dollar","HKD":"Hong Kong Dollar",
    "NOK":"Norwegian Krone","SEK":"Swedish Krona","DKK":"Danish Krone",
    "PLN":"Polish Zloty","CZK":"Czech Koruna","HUF":"Hungarian Forint",
    "TRY":"Turkish Lira","RUB":"Russian Ruble","ZAR":"South African Rand",
    "NZD":"New Zealand Dollar","THB":"Thai Baht","IDR":"Indonesian Rupiah",
    "PHP":"Philippine Peso","MYR":"Malaysian Ringgit","TWD":"Taiwan Dollar",
    "SAR":"Saudi Riyal","AED":"UAE Dirham","EGP":"Egyptian Pound",
    "NGN":"Nigerian Naira","KES":"Kenyan Shilling","ARS":"Argentine Peso",
    "CLP":"Chilean Peso","COP":"Colombian Peso","PEN":"Peruvian Sol",
    "VND":"Vietnamese Dong","BDT":"Bangladeshi Taka","PKR":"Pakistani Rupee",
    "LKR":"Sri Lankan Rupee","KHR":"Cambodian Riel","ISK":"Icelandic Krona",
    "HRK":"Croatian Kuna","RON":"Romanian Leu","BGN":"Bulgarian Lev",
    "RSD":"Serbian Dinar","UAN":"Ukrainian Hryvnia","GEL":"Georgian Lari",
    "AZN":"Azerbaijani Manat","KZT":"Kazakhstani Tenge","UZS":"Uzbekistani Som",
    "BHD":"Bahraini Dinar","JOD":"Jordanian Dinar","KWD":"Kuwaiti Dinar",
    "OMR":"Omani Rial","QAR":"Qatari Riyal"
  };

  var amountEl = document.getElementById("curAmount");
  var fromEl = document.getElementById("curFrom");
  var toEl = document.getElementById("curTo");
  var swapBtn = document.getElementById("swapBtn");
  var convertBtn = document.getElementById("convertBtn");
  var resultValue = document.getElementById("curResultValue");
  var resultRate = document.getElementById("curResultRate");

  var codes = Object.keys(RATES).sort();
  codes.forEach(function (code) {
    var opt1 = document.createElement("option");
    opt1.value = code; opt1.textContent = code + " - " + (CURRENCY_NAMES[code] || code);
    fromEl.appendChild(opt1);
    var opt2 = document.createElement("option");
    opt2.value = code; opt2.textContent = code + " - " + (CURRENCY_NAMES[code] || code);
    toEl.appendChild(opt2);
  });
  fromEl.value = "USD";
  toEl.value = "EUR";

  function convert() {
    var amount = parseFloat(amountEl.value);
    if (isNaN(amount) || amount <= 0) { window.OmniTools.showToast("Enter a valid amount.", "error"); return; }
    var from = fromEl.value;
    var to = toEl.value;
    var usdAmount = amount / RATES[from];
    var result = usdAmount * RATES[to];
    var rate = RATES[to] / RATES[from];
    resultValue.textContent = result.toFixed(2) + " " + to;
    resultRate.textContent = "1 " + from + " = " + rate.toFixed(6) + " " + to;
  }

  swapBtn.addEventListener("click", function () {
    var tmp = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = tmp;
    convert();
  });
  convertBtn.addEventListener("click", convert);
  amountEl.addEventListener("input", convert);
  fromEl.addEventListener("change", convert);
  toEl.addEventListener("change", convert);
  convert();
})();
