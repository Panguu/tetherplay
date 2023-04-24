const configuration = {

	getSetup() {
		this._indexMap = this._getConf()
		this._idMap = this._setupIdMap(this._indexMap)
		return this._indexMap
	},

	byIndex(i) {
		return this._indexMap[i]
	},
	byId(id) {
		return this._idMap[id]
	},
	hasIndex(i) {
		return  i < this._indexMap.length && 0 <= i
	},
	hasId(id) {
		return  this._idMap[id] !== undefined
	},

	_getConf() {
		conf = '[{"id":"gp-ljoy", "type":"vec8"},{"id":"gp-west","type":"bool"},{"id":"gp-south","type":"bool"},{"id":"gp-start","type":"inst"}]'
		return JSON.parse(conf)
	},

	_setupIndexMap(conf) {
		return conf.map
	},

	_setupIdMap(indexMap) {
		idMap = {}
		indexMap.forEach((item, index) => {
			idMap[item.id] = {index: index, type: item.type}
		})
		return idMap
	}

}
