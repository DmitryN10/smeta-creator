var App = angular.module('common.services');

App.controller('ActiveMenuController', function($scope, $location){
    $scope.activeFor = function (viewLocation) {
        var isActive = isArray(viewLocation)
            ? aggregation(viewLocation, isLocationActive, seed)
            : isLocationActive(false, viewLocation);
        return isActive ? "active" : "";
    };

    function seed() { return false; }
    function isLocationActive(isActive, checkLocation) {
        return (checkLocation === $location.path()) || isActive || false;
    }
});

