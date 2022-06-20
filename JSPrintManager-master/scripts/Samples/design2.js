<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
</head>
<script src="JSPrintManager.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.5/bluebird.min.js"></script>
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>

<body>
  <div style="text-align: center;">
    <h1>Print ESP/POS commands from Javascript</h1>
    <hr />
    <label class="checkbox">
      <input type="checkbox" id="useDefaultPrinter" />
      <strong>Print to Default printer</strong>
    </label>
    <p>or...</p>
    <div id="installedPrinters">
      <label for="installedPrinterName">Select an installed Printer:</label>
      <select name="installedPrinterName" id="installedPrinterName"></select>
    </div>
    <br />
    <br />
    <button type="button" onclick="print();">Print Now...</button>
  </div>
</body>

<script>
  //WebSocket settings
  JSPM.JSPrintManager.auto_reconnect = true
  JSPM.JSPrintManager.start()
  JSPM.JSPrintManager.WS.onStatusChanged = function () {
    if (jspmWSStatus()) {
      //get client installed printers
      JSPM.JSPrintManager.getPrinters().then(function (myPrinters) {
        var options = ''
        for (var i = 0; i < myPrinters.length; i++) {
          options += '<option>' + myPrinters[i] + '</option>'
        }
        $('#installedPrinterName').html(options)
      })
    }
  }

  //Check JSPM WebSocket status
  function jspmWSStatus() {
    if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Open)
      return true
    else if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Closed) {
      alert(
        'JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm',
      )
      return false
    } else if (
      JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Blocked
    ) {
      alert('JSPM has blocked this website!')
      return false
    }
  }

  //Do printing...
  function print(o) {
    if (jspmWSStatus()) {
      //Create a ClientPrintJob
      var cpj = new JSPM.ClientPrintJob()
      //Set Printer type (Refer to the help, there many of them!)
      if ($('#useDefaultPrinter').prop('checked')) {
        cpj.clientPrinter = new JSPM.DefaultPrinter()
      } else {
        cpj.clientPrinter = new JSPM.InstalledPrinter(
          $('#installedPrinterName').val(),
        )
      }
      //data set for print
      var dO = {
        logo: '',
        barcode: 'savindupasingtha@gmail.com',
        addL1: 'No 262/6',
        addL2: 'Gall Road',
        addL3: 'Colombo 7.',
        telephone: '+94 17 77 88 99',
        reciept: '991234',
        cashier: 'Robert',
        customer: 'Niki Arora',
        date: '2022-06-16 09:12am',
        paymentType: 'Card',
        items: [
          {
            name: 'Apple Juic', //string name should be less than 18 FontA eken prin wen hind ek font ekk width ek 1mm
            price: '250.00', //length ek fontA eken 5i ekk 1mm gane akuru 4k 5k denn
            Qty: '1',//length ek fontA eken 5i ekk 1mm gane akuru 4k 5k denn
            total: '250.00',//length ek fontA eken 5i ekk 1mm gane akuru 4k 5k denn
          },
          {
            name: 'Milk',
            price: '250.00',
            Qty: '1',
            total: '250.00',
          }, {
            name: 'Clothyyy',
            price: '250.00',
            Qty: '2',
            total: '250.00',
          },
          {
            name: 'Clothkk',
            price: '250.00',
            Qty: '2',
            total: '250.00',
          },
          {
            name: 'Cloth8888888888',
            price: '250.00',
            Qty: '2',
            total: '250.00',
          },
        ],
        subTotal: '250.00',
        grandTotal: '250.00',
        cash: '250.00',
        balance: '0.00',
        currencyFormat: 'LKR',
        endMsg: 'Thank you come again !!!!!!', //string length should be less than 35
      }

      //convenience method
      var chr = function (n) {
        return String.fromCharCode(n)
      }
      //barcode data
      var code = '12345'
      var barcode =
        '\x1D' +
        'h' +
        chr(80) + //barcode height
        '\x1D' +
        'f' +
        chr(0) + //font for printed number
        '\x1D' +
        'k' +
        chr(69) +
        chr(code.length) +
        code +
        chr(0) //code39
      //Set content to print...
      //Create ESP/POS commands for sample label
      var esc = '\x1B' //ESC byte in hex notation
      var newLine = '\x0A' //LF byte in hex notation
      var alignLeft = '\x1B' + '\x61' + '\x30' // left align
      var alignRight = '\x1B' + '\x61' + '\x32'
      var alignCenter = '\x1B' + '\x61' + '\x31'
      var papperCut = '\x1D' + '\x56' + '\x00'
      var doubleFontSize = '\x1B' + '!' + '\x18' //Emphasized + Double-height mode selected (ESC ! (16 + 8)) 24 dec => 18 hex 7
      var fontA = '\x1B' + '!' + '\x00' //Character font A selected (ESC ! 0)~//Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
      var space = '\x20'
      var d = new Date()
      var date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDay()
      var time = d.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
      //80mm eke row ekk akuru 40k wage dann puluwn e hing space thiy thiy string eke agt apend krnw adala spase gana
      //ex i      q   t
      //    sa    1   10
      //i idn q t space 15 e wage q idn t space 6 e wage
      function strEndToAddSpace(n, l) {
        var nm = n;
        for (let i = 0; i < (l - n.length); i++) {
          nm = nm + space;
        }
        return nm;
      }
      function strFrontToAddSpace(n, l) {
        var nm = '';
        for (let i = 0; i < l; i++) {
          nm = nm + space;
        }
        return nm + n;
      }


      /*English*/
      var cmds = esc + '@' //Initializes the printer (ESC @)
      cmds += esc + '!' + '\x38' //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
      cmds += newLine + 'Logo/Brand' //text to print
      cmds += alignCenter
      cmds += newLine + newLine + newLine
      cmds += fontA
      cmds += alignCenter
      cmds += dO.addL1
      cmds += newLine
      cmds += dO.addL2
      cmds += newLine
      cmds += dO.addL3
      cmds += newLine
      cmds += dO.telephone
      cmds += newLine + newLine
      cmds += alignCenter
      cmds += '-----------------------------------------------'
      cmds += alignCenter
      cmds += newLine + newLine
      cmds += alignLeft + fontA
      cmds += `Reciept     #:${dO.reciept}             `
      cmds += newLine
      cmds += `Cashier      :${dO.cashier}             `
      cmds += newLine
      cmds += `Customer     :${dO.customer}            `
      cmds += newLine
      cmds += `Date  #      :${dO.date}                `
      cmds += newLine
      cmds += `Payment type :${dO.paymentType}         `
      cmds += newLine + newLine
      cmds += alignCenter
      cmds += '-----------------------------------------------'
      cmds += alignCenter
      cmds += newLine + newLine
      cmds += alignLeft + fontA

      var itemName = strEndToAddSpace('Item Price', 20)
      var itemQty = strEndToAddSpace('Qty', 4)
      var itemTotal = strFrontToAddSpace(`Total(${dO.currencyFormat})`, 10)
      cmds += `${itemName}${itemQty}${itemTotal}`

      cmds += newLine
      //arr[i].name.length
      for (let i = 0; i < dO.items.length; i++) {
        var arr = dO.items
        var itemName = strEndToAddSpace(arr[i].name, 17)
        var itemQty = strEndToAddSpace(arr[i].Qty, 4)
        var itemTotal = strFrontToAddSpace(arr[i].total, 10)
        cmds += alignLeft
        cmds += `${i + 1}: ${itemName}${itemQty}${itemTotal}`
        cmds += newLine
        cmds += alignLeft
        cmds += `   ${arr[i].price}`
        cmds += newLine
      }
      cmds += newLine
      cmds += alignCenter
      cmds += '-----------------------------------------------'
      cmds += alignCenter
      cmds += newLine
      cmds += alignLeft
      cmds += `Sub total(${dO.currencyFormat})                    ${dO.subTotal}`
      cmds += newLine
      cmds += alignCenter
      cmds += '-----------------------------------------------'
      cmds += alignCenter
      cmds += alignLeft
      cmds += newLine
      cmds += `Grand total(${dO.currencyFormat})                  ${dO.grandTotal}`
      cmds += newLine
      cmds += `Cash(${dO.currencyFormat})                         ${dO.cash}`
      cmds += newLine
      cmds += `Balance(${dO.currencyFormat})                      ${dO.balance}`
      cmds += newLine
      cmds += alignCenter
      cmds += '-----------------------------------------------'
      cmds += alignCenter
      cmds += newLine + newLine
      //cmds += barcode
      cmds += alignCenter
      cmds += `${dO.endMsg}`
      cmds += alignCenter
      cmds += newLine + newLine + newLine + newLine + newLine + newLine
      cmds += papperCut
      cpj.printerCommands = cmds
      cpj.sendToClient()

      /*Arabic*/
      /*
          var cmds = esc + '@' //Initializes the printer (ESC @)
          cmds += esc + '!' + '\x38' //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
          cmds += newLine + 'NVISION (PVT) LTD' //text to print
          cmds += newLine + newLine
          cmds += esc + '!' + '\x00' //Character font A selected (ESC ! 0)
          cmds += 'بسكويت                   5.00'
          cmds += newLine
          cmds += 'لبن             3.78'
          cmds += newLine + newLine
          cmds += esc + '!' + '\x18' //Emphasized + Double-height mode selected (ESC ! (16 + 8)) 24 dec => 18 hex
          cmds += '# العناصر بيعت 2'
          cmds += esc + '!' + '\x00' //Character font A selected (ESC ! 0)
          cmds += newLine + newLine
          cmds += '11/03/13  19:53:17'
          cmds += newLine + newLine
          cpj.printerCommands = cmds
          //Send print job to printer!
          cpj.sendToClient()
          */
      /*Hindi*/
      /*Kashmir*/
      /*French*/
      /*Russian*/
      /*Chinees*/
      /*Japan*/

      /**
           //Set content to print...
          //Create ESP/POS commands for sample label
          var esc = '\x1B' //ESC byte in hex notation
          var newLine = '\x0A' //LF byte in hex notation
          /*English*/
      /*var cmds = esc + '@' //Initializes the printer (ESC @)
          cmds += esc + '!' + '\x38' //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
          cmds += newLine + 'NVISION (PVT) LTD' //text to print
          cmds += newLine + newLine
          cmds += esc + '!' + '\x00' //Character font A selected (ESC ! 0)
          cmds += 'COOKIES                   5.00'
          cmds += newLine
          cmds += 'MILK 65 Fl oz             3.78'
          cmds += newLine + newLine
          cmds += esc + '!' + '\x18' //Emphasized + Double-height mode selected (ESC ! (16 + 8)) 24 dec => 18 hex
          cmds += '# ITEMS SOLD 2'
          cmds += esc + '!' + '\x00' //Character font A selected (ESC ! 0)
          cmds += newLine + newLine
          cmds += '11/03/13  19:53:17'
          cmds += '\x1B' + '\x61' + '\x32' //right align
          cmds += newLine + newLine
          cmds += newLine + newLine
          cmds += '\x1B' + '\x61' + '\x31' //barcd ek center align
          cmds += barcode
          cmds += newLine + newLine
          cmds += newLine + newLine
          cmds += '\x1D' + '\x56' + '\x00' //cut
          cpj.printerCommands = cmds
          */
    }
  }
</script>

</html>