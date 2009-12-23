var c = require("../external/class");

exports.Widget = c.Class.extend({

	// Arrays of objects: { t(ype), l(istener) [, id] }
	listeners: [],
	clientListeners: [],
	
	// Counter to increment if no ID is specified for a listener
	idCounter: 0,

	serialize: function() {
		// Only client side listener are sent over the wire
		return {
			listeners: this.clientListeners
		};
	},
	
	/**
	 * returns the listenerId, either the one specified or a generated one
	 */
	addListener: function(type, listener, listenerId) {
		if(!listenerId) {
			listenerId = this.idCounter++;
		}
		if(typeof listener == "string")
			this.clientListeners.push({t: type, l: listener, id: listenerId});
		else
			this.listeners.push({t: type, l: listener, id: listenerId});
		return listenerId;
	}
    
});