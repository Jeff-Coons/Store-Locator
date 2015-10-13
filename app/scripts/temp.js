
// Create global variable to access it's methods
window.Temp = (function () {

    // Declare the contructor
    function Temp(cool) {
        for(var i = 0; i < cool.length; i++) {
            this[i] = cool[i];
        }
        this.length = cool.length;
    };

    Temp.prototype.map = function(callback) {
        var results = [];
        for( ; i < this.length; i++) {
            results.push(callback.call(this, this[i], i))
        }
        return results;
    };

    Temp.prototype.forEach = function(callback) {
        this.map(callback);
        return this;
    };

    Temp.prototype.mapOne = function(callback) {
        var m = this.map(callback);
        return m.length > 1 ? m : m[0];
    };

    Temp.prototype.text = function(text) {
        if (typeof text !== 'undefined') {
            return this.forEach(function (el) {
                el.innerText = el;
            });
        } else {
            return this.mapOne(function (el) {
                return el.innetText;
            })
        }
    };

    var temp = {
        get: function (selector) {

            var cool;

            if (typeof selector === 'string' ) {
                cool = document.querySelectorAll(selector);
            } else if (selector.length) {
                cool = selector;
            } else {
                cool = [selector]
            }

            return new Temp(cool);
        }
    };

    return temp;
}());
