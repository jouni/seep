exports.make = function(targetClass) {

	return targetClass.extend({
	
		init: function(props) {
			this._super(props)
			this.outBuffer.focusable = true
		},
	
		focus: function() {
			if(this.application) {
				this.application.focus(this)
			} else {
				this._pendingFocus = true
			}
		},
		
		setApplication: function(app) {
			this._super(app)
			if(this._pendingFocus) {
				app.focus(this)
				this._pendingFocus = false
			}
		}
	
	})
	
}