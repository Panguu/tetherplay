const express = require('express')
const getopts = require('getopts')
const ws = require('./ws')

const config = getopts(process.argv.slice(2), {
  alias: {
    sink: 's'
  },
})

ws.start(config)
var qrcode = require("qrcode-terminal")
var ip = require("ip")
var app = express()

var port = 3000
app.use(express.static('style'));
app.use(express.static('client-scripts'));
app.use(express.static('img'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.get('/settings', function (req, res) {
    res.sendFile(__dirname + '/settings.html');
})
app.get('/favicon.png', function (req, res) {
    res.sendFile(__dirname + '/img/tetherplay.png');
})

app.listen(port, function () {
  console.log('Server Started');
  console.log('Listening on internal network: \x1b[36m\x1b[4mhttp://%s\x1b[0m', `127.0.0.1:${port}`);
  console.log('Listening on local network: \x1b[36m\x1b[4mhttp://%s\x1b[0m', `${ip.address()}:${port}`);
  qrcode.generate(`http://${ip.address()}:${port}`);
})
