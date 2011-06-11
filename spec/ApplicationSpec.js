var seep = require("seep")


describe("Application", function() {
	/*var app = new seep.Application.extend({
			init: function() {
				this._super("Title")
			}
		})*/
	var test = new seep.Text("Foobar")
	
	beforeEach(function() {

	})

	it("should have a name", function() {
		//expect(app.name).toEqual("Title")
	})

})

/*

describe('jasmine-node', function(){

  it('should pass', function(){
    expect(1+2).toEqual(3);
  });

  it('shows asynchronous test', function(){
    setTimeout(function(){
      expect('second').toEqual('second');
      asyncSpecDone();
    }, 1);
    expect('first').toEqual('first');
    asyncSpecWait();
  });
});*/