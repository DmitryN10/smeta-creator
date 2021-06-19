(function () {
    'use strict';
    angular.module('securityApp', ['angular-loading-bar', 'securityApp.services', 'angularjs-dropdown-multiselect',
        'ui.bootstrap', 'ui.bootstrap.dropdown', 'ui.bootstrap.modal', 'ui.bootstrap.tpls', 'ngHandsontable',
        'ngRoute', 'ngSanitize', 'ui.select', 'angular.snackbar','common.services', 'angucomplete-alt','angular-confirm'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/smeta', {
                    templateUrl: 'smeta',
                    controller: 'MarketCorrelController'
                })
                .when('/smetaOld', {
                    templateUrl: 'smetaOld',
                    controller: 'MarketCorrelControllerOld'
                })
                .when('/hello', {
                    templateUrl: '/hello'
                })
                .otherwise({
                    redirectTo: '/smeta'
                });
        }])
        .filter('unique', function () {
            return function (arr) {
                return _.uniq(arr);
            };
        });
}());
