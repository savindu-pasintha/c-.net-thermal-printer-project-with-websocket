//1 width == 80 mm
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
var fontA = '\x1B' + '!' + '\x00' //Character font A selected (ESC ! 0)
var d = new Date()
var date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDay()
var time = d.toLocaleString('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
})
/*English*/
var cmds = esc + '@' //Initializes the printer (ESC @)
cmds += esc + '!' + '\x38' //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
cmds += newLine + 'Sales Play POS' //text to print
cmds += alignCenter
cmds += newLine + newLine + newLine
cmds += doubleFontSize
cmds += alignLeft
cmds += 'Total (LKR) 4,398.00  ' + fontA + date + ' ' + time
cmds += fontA
cmds += newLine + newLine
cmds += 'ICE Cream                     2,400.00'
cmds += newLine
cmds += '2 x 1,200'
cmds += newLine
cmds += 'Chicken                       1,998.00'
cmds += newLine
cmds += '2 x 999.00'
cmds += newLine
cmds += '                  Sub   total 4,398.00 '
cmds += newLine
cmds += '                  Grand total 4,398.00 '
cmds += newLine
cmds += '                  Amount Charged       '
cmds += newLine
cmds += '                    Cash  LKR 4,398.00 '
cmds += newLine + newLine
cmds += alignCenter
cmds += barcode
cmds += newLine
cmds += 'Thank You !'
cmds += alignCenter
cmds += newLine + newLine + newLine + newLine + newLine + newLine
cmds += papperCut
cpj.printerCommands = cmds
cpj.sendToClient()
