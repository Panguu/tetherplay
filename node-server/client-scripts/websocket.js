const ws = new WebSocket('ws://' + window.location.hostname + ':40510');

ws.onmessage = function (ev) { console.log(ev); }

function send(s) {
	ws.send(s);
}

