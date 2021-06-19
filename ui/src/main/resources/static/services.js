'use strict';
var CONTENT_TYPE_JSON = {
    headers: {'Content-Type': 'application/json;charset=UTF-8'}
};

angular.module('securityApp.services', [])
    .factory("enitytService", function ($http) {
        return {
            loadAll: function () {
                return $http.get('/all')
            },
            loadAllCounterparties: function () {
                return $http.get('/allCounterparties')
            },
        }
    })
    .factory("hotUtils", function () {
        return {
            commonRenderer: function commonRenderer(instance, td, row, col, prop, value, cellProperties) {
                td.style.color = 'black';
                Handsontable.renderers.TextRenderer.apply(this, arguments);
            },
            setColumn: function setColumn(data, title, renderer) {
                var column = {data: data, title: title, className: 'htCenter htMiddle', readOnly: true};
                column.renderer = (renderer) ? renderer : this.commonRenderer;
                return column;
            }
        }
    })
;