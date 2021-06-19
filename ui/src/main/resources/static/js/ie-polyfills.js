/**
 * Missing ECMAScript 2015 Object functionality for Internet Explorer 8+.
 * This module must be included before any other ones which use the replicated functions.
 */
(function () {
    'use strict';
    // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
    if (!String.prototype.startsWith) {
        Object.defineProperty(String.prototype, 'startsWith', {
            value: function(search, pos) {
                pos = !pos || pos < 0 ? 0 : +pos;
                return this.substring(pos, pos + search.length) === search;
            }
        });
    }
})();