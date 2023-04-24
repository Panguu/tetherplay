class _Control{
	constructor(element, updateCallback) {
		this.element = element
		this.onUpdate = () => updateCallback(this)
	}
	set(val) {
		if (this.value == val)
			return false
		this.value = val
		this.onUpdate()
		return true
	}
	getChildren(tagname) {
		return Array.prototype.slice.call(
			this.element.getElementsByTagName(tagname)
		)
	}
	getRelativeCoordinates(coordinates) {
		var bounds = this.element.getBoundingClientRect()
		return [
			(coordinates[0] - bounds.x) / bounds.width,
			(coordinates[1] - bounds.y) / bounds.height
		]
	}
	onPress(pressEvent = undefined) { 
		window.navigator.vibrate(32);
	}
	onRelease(releaseEvent = undefined) { }
	onDrag(dragEvent = undefined) { }
	valueOf() { return this.value }
}

class VecControl extends _Control {
	constructor(element, updateCallback) {
		super(element, updateCallback)
		this.value = [0,0]
	}

	// convert raw value to native datatype
	processVal(val) {
		return val * 2 -1
	}
	unProcessVal(val) {
		return (val + 1) / 2
	}

	processVec(vec) {
		return this.boundVec( vec.map(this.processVal) )
	}

	boundVec(vec) {
		var majorLength = vec.map( v => Math.abs(v) ).reduce( (a,b) => Math.max(a,b)
		)
		if (majorLength > 1)
			return vec.map( v => v / majorLength )
		return vec
	}

	getEventRelativeCoordinates(evt) {
		return this.processVec(
			this.getRelativeCoordinates([evt.x, evt.y])
		)
	}
	childRelativeCoordinates(child) {
		return this.processVec(
			this.getRelativeCoordinates(getElementCenter(child))
		)
	}

	onRelease(releaseEvent = undefined) {
		super.onRelease(releaseEvent)
		this.set([0,0])
	}
}

function getMinorDimension(element) {
	var bounds = element.getBoundingClientRect()
	return Math.min(bounds.width, bounds.height)
}

function getElementCenter(element) {
	var bounds = element.getBoundingClientRect()
	return [
		bounds.left + ((bounds.right - bounds.left) / 2),
		bounds.top + ((bounds.bottom - bounds.top) / 2)
	]
}

function taxiCabDist(p1, p2 = [0,0]) {
	return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])
}

function magnitudeSqr(vec) {
	return vec.map( a => a*a ).reduce( (a, b) => a + b)
}

function squared(x) {
	return x * x
}
const sqrt2 = Math.sqrt(2)
function unitSquareRadius(angle) {
	return squared(Math.abs((4 * angle / Math.PI - 1)) % 2 - 1) * (sqrt2 - 1) + 1
}

function mapCircleToSquare(point) {
	var angle = Math.atan2(point[0], point[1])
	return point.map( v =>  v * unitSquareRadius(angle) )
}

function mapSquareToCircle(point) {
	var angle = Math.atan2(point[0], point[1])
	return point.map( v =>  v / unitSquareRadius(angle) )
}

function clamp(a, min, max) {
	return Math.max(Math.min(a, max), min)
}

function boundVecToCircle(vec) {
	var magSqr = magnitudeSqr(vec)
	if (magSqr > 1)
		return vec.map( v => v / Math.sqrt(magSqr) )
	return vec
}

function absFloor(a) {
	return a < 0 ? Math.ceil(a) : Math.floor(a)
}
function absCeil(a) {
	return a < 0 ? Math.floor(a) : Math.ceil(a)
}

const control = {

	inst: class InstControl extends _Control {
		constructor(element, updateCallback) {
			super(element, updateCallback)
			this.value = undefined
		}
		onPress(pressEvent = undefined) {
			super.onPress(pressEvent)
			this.onUpdate()
		}
	},

	bool: class BoolControl extends _Control {
		constructor(element, updateCallback) {
			super(element, updateCallback)
			this.value = false
		}
		onPress(pressEvent = undefined) {
			super.onPress(pressEvent)
			this.set(true)
		}
		onRelease(releaseEvent = undefined) {
			super.onRelease(releaseEvent)
			this.set(false)
		}
	},
	dir4: class Dir4Control extends VecControl {
		constructor(element, updateCallback) {
			super(element, updateCallback)
			this.children = this.getChildren("button")
			this.directions = this.children.map(child =>
				this.childRelativeCoordinates(child)
			)
		}

		processVec(vec) {
			vec = super.processVec(vec)
			for (const dir4 of [[1,0],[0,1],[-1,0],[0,-1]]) {
				if (taxiCabDist(vec, dir4) < 1)
					{ return dir4 }
			}
			return [0,0]
		}

		directionOfChild(child) {
			var i = this.children.indexOf(child)
			if ( i == -1 ) {
				throw "this child is not ours"
			}
			return this.directions[i]
		}

		onPress(pressEvent = undefined) {
			super.onPress(pressEvent)
			var targ = pressEvent.target //TODO find target be searching up the tree
			if (targ == this.element)
				{ return }
			try {
				this.set( this.directionOfChild(targ) )
			} catch (e) {console.error(e)}
		}
	},

	vec8: class Vec8Control extends VecControl {
		constructor(element, updateCallback){
			super(element, updateCallback)
			this.stick = this.getChildren("button")[0]
			this.stickMaxTravel = (getMinorDimension(this.element) - getMinorDimension(this.stick)) / 2
			this.drawJoystick(this.value)
		}

		set(val) {
			if (super.set(val))
				this.drawJoystick()
		}

		processVec(vec) {
			return mapCircleToSquare( super.processVec(vec) ).map( v =>
				clamp( absFloor(v * 7), -7, 7)
			)
		}

		getRelativeCoordinates(coordinates) {
			var bounds = this.element.getBoundingClientRect()
			bounds.x += this.stickMaxTravel
			bounds.y += this.stickMaxTravel
			bounds.width -= this.stickMaxTravel * 2
			bounds.height -= this.stickMaxTravel * 2
			return [
				(coordinates[0] - bounds.x) / bounds.width,
				(coordinates[1] - bounds.y) / bounds.height
			]
		}

		drawJoystick(){
			var coordinates = mapSquareToCircle(this.value).map( v =>
				v / 7 *  this.stickMaxTravel + "px"
			)
			this.stick.style.left = coordinates[0]
			this.stick.style.top = coordinates[1]
		}

		onPress(pressEvent = undefined){
			super.onPress(pressEvent)
			this.onDrag(pressEvent)
		}

		onDrag(dragEvent = undefined) {
			super.onDrag(dragEvent)
			this.set(this.getEventRelativeCoordinates(dragEvent))
		}
	}
}
