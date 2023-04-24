var state = []

var targetCache = {};
function getDownEventTarget(evt) {
	for (i = 0; i < evt.path.length; i++) {
		var target = evt.path[i]
		if (configuration.hasId(target.id)) {
			targetCache[evt.pointerId] = target
			return target
		}
	}
	return undefined
}
function getLifetimeEventTarget(evt) {
	return targetCache[evt.pointerId]
}
function getReleaseEventTarget(evt) {
	var out = targetCache[evt.pointerId]
	targetCache[evt.pointerId] = undefined
	return out
}

function encodeState(index) {
	return JSON.stringify({i:index, v:state[index].valueOf()})
}

function onStateUpdate(which = null) {
	if (which) {
		send(encodeState(state.indexOf(which)))
	} else {
		for(i = 0; i < state.length; i++)
			{send(encodeState(i))}
	}
	showState()
}

function getControlByElement(element) {
	return state[configuration.byId(element.id).index]
}

function callControlMethod(element, method, evt) {
	if (!element)
		{ return }
	return getControlByElement(element)[method](evt)
}

function processEvent(evt) {
	evt.preventDefault()
	evt.path = evt.path || (evt.composedPath && evt.composedPath()); // event.path is nonstandard
}

function handlePressEvent(evt) {
	processEvent(evt)
	callControlMethod( getDownEventTarget( evt ), "onPress", evt)
}

function handleReleaseEvent(evt) {
	processEvent(evt)
	callControlMethod( getReleaseEventTarget( evt ), "onRelease", evt)
}

function handleDragEvent(evt) {
	processEvent(evt)
	callControlMethod( getLifetimeEventTarget( evt ), "onDrag", evt)
}
