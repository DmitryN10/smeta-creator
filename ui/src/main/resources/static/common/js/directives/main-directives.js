var App = angular.module('common.services');
App.config(function ($provide, $compileProvider, $filterProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|file|blob|data):/);
});

App.directive('bDatepicker', function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        terminal: true,
        scope: {ngModel: '='},
        link: function ($scope, element, attrs, controller) {
            element.datepicker({
                format: attrs.bDatepicker,
                autoclose: true,
                todayHighlight: true,
                orientation: "top right",
                weekStart : 1
            }).on('changeDate', function (e) {
                controller.$setViewValue(e.date);
                $scope.$apply();
            }).datepicker("update", $scope.ngModel);
        }
    };
});

App.directive("changeMark", function () {
    return {
        restrict: 'E',
        scope: {showFor: '=', initValue: '='},
        replace: true,
        template:
        '<span class="glyphicon glyphicon-asterisk text-danger" ' +
            'style="cursor: pointer;" aria-hidden="true" ' +
            'title="The value has been changed.\nClick on the mark to restore the previous value." ' +
            'ng-show="markAsChanged()" ng-click="restore()"/>',
        controller: function ($scope) {
            function getOrDefault(val, def) { return val === "" ? val : val || def; }
            function getPrevValue() { return ($scope.prevValue = getOrDefault($scope.initValue, $scope.prevValue)); }

            $scope.prevValue = getOrDefault($scope.initValue, $scope.showFor || "");
            $scope.markAsChanged = function () { return $scope.showFor !== getPrevValue(); };
            $scope.restore = function () { $scope.showFor = getPrevValue(); };
        }
    }
});

App
    .service('clickOutsideService', function ($document) {
        this.bind = function (scope, element, handler) {
            $document.bind('click', clickOutsideHandler);
            element.bind('remove', function () {
                $document.unbind('click', clickOutsideHandler);
            });

            function clickOutsideHandler(event) {
                event.stopPropagation();
                var targetParents = $(event.target).parents();
                var inside = targetParents.index(element) !== -1;
                var on = event.target === element[0];
                var outside = !inside && !on;

                if (outside) scope.$apply(function () {
                    handler(scope, {$event: event});
                });
            }
        }
    })

    .directive('clickOutside', function ($parse, $document, clickOutsideService) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var fn = $parse(attr.clickOutside);
                clickOutsideService.bind(scope, element, fn);
            }
        }
    })

    .directive('hidden', function () {
        return {
            restrict: 'E',
            scope: {
                max: '=max',
                min: '=min'
            },
            link: function (scope, element, attr, ctrl) {
                if (attr.min) {
                    var minValidator = function (value) {
                        var min = parseFloat(attr.min);
                        return validate(ctrl, 'min', ctrl.$isEmpty(value) || value >= min, value);
                    };
                    ctrl.$parsers.push(minValidator);
                    ctrl.$formatters.push(minValidator);
                }

                if (attr.max) {
                    var maxValidator = function (value) {
                        var max = parseFloat(attr.max);
                        return validate(ctrl, 'max', ctrl.$isEmpty(value) || value <= max, value);
                    };

                    ctrl.$parsers.push(maxValidator);
                    ctrl.$formatters.push(maxValidator);
                }
            }
        };
    })

    .directive('popup', function ($compile, $parse, clickOutsideService) {
        return {
            require: '^?form',
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs, ctrl, $transclude) {
                var options = {};
                if (attrs.options !== undefined) options = $parse(attrs.options)(scope);

                $transclude(scope, function (clone, scope) {
                    var popover = $(element).parent().popover({
                        title: options.title || null,
                        placement: options.placement || 'right',
                        delay: (options.delay ? angular.toJson(options.delay) : null),
                        trigger: options.trigger || 'hover',
                        html: 'true',
                        content: function () { return clone },
                        close: function () { popover.popover('hide'); }
                    });
                    scope.closePopup = function () { popover.popover('hide'); };
                    clickOutsideService.bind(scope, popover.parent(), function () { popover.popover('hide'); });
                });
            }
        };
    })
    .directive('popupInner', function ($compile, $parse, clickOutsideService) {
        return {
            restrict: 'E',
            transclude: true,
            link: function (scope, element, attrs, controller, transclude) {
                var innerScope = scope.$new();
                transclude(innerScope, function (clone) {
                    element.empty();
                    var content = $compile('<div>  </div>')(innerScope); // for ng-repeat need parent element
                    content.append(clone);

                    var options = {};
                    if (attrs.options !== undefined) {
                        options = $parse(attrs.options)(innerScope);
                    }
                    var popover = $(element).parent().popover({
                        title: options.title || null,
                        placement: options.placement || 'right',
                        html: 'true',
                        delay: (options.delay ? angular.toJson(options.delay) : null),
                        trigger: options.trigger || 'hover',
                        content: content
                    });
                    innerScope.closePopup = function () { popover.popover('hide'); };
                    clickOutsideService.bind(innerScope, popover.parent(), function () { popover.popover('hide'); });
                });
            }
        };
    });