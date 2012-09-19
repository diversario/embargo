# Embargo

Embargo is a helper (or a mock) that replaces specific `require` calls with a user-defined stub. 

# Install

    $ npm install embargo

# Use

To override a module:

    var embargo = require('embargo');
    
    embargo.someModule = {
      'doStuff': function(arg, cb) {
        cb(null, 'it worked!');
      }
    }
    
    var someModule = require('someModule');
    
    console.log(someModule.doStuff(null, function(err, result){
      console.log(err, result); // null, 'it worked!'
    });

By doing this, you're saying that `require('someModule')` will return an object with a `doStuff` property that you specified in `overrides` object, instead of actual module exports.
This override will propagate to all `require` calls in the current VM. It should also work for modules `require`d through relative path.

# License

(The MIT License)

Copyright (c) 2012 Ilya Shaisultanov. http://geekli.st/diversario

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
