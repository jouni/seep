# Seep.js
### A web application UI library/framework for Node.js

Seep provides user interface controls for your Node.js web applications. The UI logic runs in the server, but you can expose parts of it by "seeping" some of the logic to the client (browser) as well.

***Note: purely experimental at this point, not recommended for anything serious***

## Installation

1. Install node.js (<http://nodejs.org>)
2. Install npm
        
        $ curl http://npmjs.org/install.sh | sh
        
3. Install seep
        
        $ npm install seep
        

## Hello World

First create a new application file:

my-app.js

    var seep = require("seep")
    
    var app = seep.Application.extend({
    
  	  start: function() {
  		  this.add(new seep.Text("Hello World!"))
  	  }
    
    })

Then in the command line

    $ seep start my-app.js


## License

MIT LICENSE

Copyright (C) 2009-2011 Jouni Koivuviita

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.