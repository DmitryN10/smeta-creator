(function (angular, prepareResponse, toBusinessDate) {
    'use strict';
    var SNACKBAR_TIME = 720000;

    angular.module('securityApp')
        .controller('MarketCorrelController', ['$scope', 'snackbar', 'enitytService', function ($scope, snackbar, enitytService) {
            $scope.hotInstance = null;
            $scope.previousRegionId = null;


            $scope.entities = [];
            $scope.entityNames = [];
            $scope.counterparty = {};
            $scope.counterpaties = [];

            $scope.pairs = [];

            $scope.labelsByType = [];

            $scope.counterPartySettings = {
                selectionLimit: 1,
                externalIdProp: '',
                displayProp: 'name',
                idProp: 'name',
                showUncheckAll: false,
                showCheckAll: false,
                enableSearch: true,
                scrollable: true,
                scrollableHeight: 400,
                smartButtonMaxItems: 1
            };


            $scope.hotColumns = [

                {data: 'index', title: 'N'+'\n'+'п/п', source: $scope.index, width: 50},
                {data: 'id', title: 'N'+'\n'+'расц.', source: $scope.id, width: 50},

                {data: 'name', title: "Наименование работ, \n материалов", type: 'dropdown', source: $scope.entityNames, width: 250},

                {data: 'workType', title: 'Ед. измерения работ', width: 130},
                {data: 'workScope', title: 'Объем работ', width: 100},
                {data: 'workCost', title: 'Ст-ть за ед. измерения работ (руб.)', width: 220},
                {data: 'workCostAll', title: 'Ст-ть работ итого (руб.)', width: 150},

                {data: 'materialType', title: 'Ед. измерения материалов', width: 180},
                {data: 'materialScope', title: 'Объем материалов', width: 130},
                {data: 'materialCost', title: 'Ст-ть за ед. измерения матералов (руб.)', width: 100},
                {data: 'materialCostAll', title: 'Ст-ть материалов итого (руб.)', width: 100},


                {data: 'finalCost', title: 'Всего', finalCost: 120},
            ];

            $scope.hotSettings = {
                minRows: 1,
                allowInsertRow: true,
                outsideClickDeselects: false,
                height: 400,
                afterInit: function () {
                    $scope.hotInstance = this;
                },
                beforeChange: function (changes, source) {
                    if (source !== 'edit' && source !== 'paste') return;
                    changes.forEach(function (change) {
                        var row = change[0];
                        var prop = change[1];
                        var newValue = change[3];

                        if (prop === 'name') {
                            let entity = $scope.entitiesByName.get(newValue);
                            let isWork = entity.work;
                            $scope.hotInstance.setDataAtCell(row, 1, entity.positionNumber);
                            $scope.hotInstance.setDataAtCell(row, isWork? 3 : 7, entity.type);
                            $scope.hotInstance.setCellMeta(row, isWork? 8 : 4, 'readOnly', true);
                            $scope.hotInstance.setDataAtCell(row, isWork? 5 : 9, $scope.loadCost(entity));
                            $scope.hotInstance.setCellMeta(row, 7 , 'readOnly', true);
                            $scope.hotInstance.setCellMeta(row,  3, 'readOnly', true);
                            $scope.hotInstance.setCellMeta(row, 5, 'readOnly', true);
                            $scope.hotInstance.setCellMeta(row, 9 , 'readOnly', true);
                        }
                        if (prop === 'workScope'){
                            let cost = $scope.hotInstance.getDataAtCell(row, 5);
                            $scope.hotInstance.setDataAtCell(row, 6, Math.round(newValue*cost));
                            $scope.hotInstance.setDataAtCell(row, 11, Math.round(newValue*cost));
                        }
                        if (prop === 'materialScope'){
                            let cost = $scope.hotInstance.getDataAtCell(row, 9);
                            $scope.hotInstance.setDataAtCell(row, 10, Math.round(newValue*cost));
                            $scope.hotInstance.setDataAtCell(row, 11, Math.round(newValue*cost));
                        }
                    });
                }
            };

            $scope.loadCost = function (entity) {
                let id = $scope.counterparty.regionId;
                switch (id) {
                    case 1:
                        return entity.cost1;
                    case 2:
                        return entity.cost2;
                    case 3:
                        return entity.cost3;
                    case 4:
                        return entity.cost3;
                    case 5:
                        return entity.cost3;
                    case 6:
                        return entity.cost3;
                };
            };

            $scope.init = function () {
                $scope.date = new Date();
                toBusinessDate($scope.date, -1);
                $scope.pairs = [];
                $scope.loadAllCounterparties();
                $scope.loadAll();
            };

            $scope.loadAllCounterparties = function () {
                enitytService.loadAllCounterparties()
                    .success(function (response) {
                        Array.from(response).forEach(function (name) {
                            $scope.counterpaties.push(name);
                        })
                    });
            }

            $scope.loadAll = function(){
                enitytService.loadAll()
                    .success(function(response){
                        var init = new Map();
                        angular.forEach(response, function (entity) {
                            init.set(entity.name, entity);
                        });
                        $scope.entitiesByName = init;
                         Array.from( $scope.entitiesByName.keys()).forEach(function (name) {
                             $scope.entityNames.push(name);
                        })
                    });
            };

            $scope.onDateChange = function () {
                if (checkIsDate($scope.date)) return;
                    if (!$scope.isActiveMode()) {
                        $scope.date = YYYYMMDDdate($scope.date.toISOString());
                        $scope.getHistory();
                    }
            };

            $scope.add = function () {
                $scope.pairs.push({});
                $scope.changed = true;
            };

            $scope.del = function() {
                if ($scope.hotInstance) {
                    var sel = $scope.hotInstance.getSelected();
                    if (sel) {
                        _.each($scope.pairs, function(fn, index) {
                            if (index >= sel[0] && index <= sel[2]) {
                                fn.del = true;
                            }
                        });
                    }
                    $scope.hotInstance.deselectCell();
                }
                $scope.pairs = _.filter($scope.pairs, function(p){ return !(p.del || false) });
            };

            $scope.recalcPrices = function (){
                let newRegionId = $scope.counterparty.regionId;
            };

            function validateCells(onSuccessfulValidation) {
                $scope.hotInstance.validateCells(function (cellsAreValid) {
                    if (cellsAreValid) onSuccessfulValidation();
                    else snackbar.create('Please review your input values', SNACKBAR_TIME);
                });
            }

            function checkValueDate(onCorrectDate) {
                if ($scope.date !== undefined) onCorrectDate();
                else snackbar.create('Please choose value date', SNACKBAR_TIME);
            }


            function freezeTable(frozenFlag) {
                $scope.hotInstance.updateSettings({
                    readOnly: frozenFlag,
                    contextMenu: !frozenFlag,
                    manualColumnResize: !frozenFlag,
                    manualRowResize: !frozenFlag,
                    comments: !frozenFlag
                });
            }
        }])
})(window.angular, window.prepareResponse, window.toBusinessDate);