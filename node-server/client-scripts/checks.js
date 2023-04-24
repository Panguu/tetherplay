const checks = {
	criticalMisjudgement(severity, description) {
		const options = [
			console.error,
			//TODO put logging func here
			function(desc){throw desc},
			window.alert
		]
		for (var i = 0; i <= severity && i < options.length; i++) {
			options[i](description)
		}
	},

	isNot(expression, errormsg, severity = 0) {
		expression = Boolean(expression)
		if (expression) {
			this.criticalMisjudgement(severity, errormsg)
		}
		return expression
	},

	arrayHasElem(a, i) {
		return typeof(a[i]) !== 'undefined'
	}
}


