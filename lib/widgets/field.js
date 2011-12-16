exports.make = function(targetClass) {
	return targetClass.extend({

		init: function(props) {
			this.dependsOn("field")
			this._super(props)
			this.pushProp("disabled")
			this.pushProp("readOnly")
			this.pushProp("tabIndex")
		}
	
	})
}