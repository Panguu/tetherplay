function start(config) {
	const wss = new (require('ws').Server)({port: 40510})
	const tpinput = require('./tpinput')

	function bind_controller(websocket) {
		websocket.controller = tpinput.open(config)
		websocket.controller.on('close', (code, sig) => {
			if (sig == 'SIGTERM' || sig == 'SIGKILL')
				return
			console.error(`${websocket.id}: Controller closed unexpectedly, restarting`)
			bind_controller(websocket)
		})
	}

	wss.on('connection', (ws, req) => {
		ws.id = req.socket.remoteAddress
		console.log(`New connection: ${ws.id}`)

		bind_controller(ws)

		ws.on('message', message => {
			ws.controller.stdin.write(message + '\n')
		})
		ws.on('close', (code, reason) => {
			console.error(`${ws.id}: Connection closed${reason ? ": " + reason : ""}`)
			ws.controller.kill()
		})
	})
}

module.exports.start = start;
