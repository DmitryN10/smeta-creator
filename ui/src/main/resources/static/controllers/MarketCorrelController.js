(function (angular, prepareResponse, toBusinessDate) {
    'use strict';
    var SNACKBAR_TIME = 720000;

    angular.module('securityApp')
        .controller('MarketCorrelController', ['$scope', 'snackbar', 'enitytService', function ($scope, snackbar, enitytService) {
            $scope.hotInstance = null;
            $scope.previousRegionId = null;
            var example2 = document.getElementById('example2'),
                hot2;


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

            function getEntities() {
                return $scope.pairs;
            }

            hot2 = new Handsontable(example2, {
                data: getEntities(),
                minRows: 1,
                allowInsertRow: true,
                outsideClickDeselects: false,
                height: 400,
                colHeaders: ['N'+'\n'+'п/п', 'N'+'\n'+'расц.', 'Наименование работ, \n материалов',
                    'Ед. измерения работ', 'Объем работ', 'Ст-ть за ед. измерения работ (руб.)', 'Ст-ть работ итого (руб.)',
                    'Ед. измерения материалов', 'Объем материалов', 'Ст-ть за ед. измерения матералов (руб.)', 'Ст-ть материалов итого (руб.)',
                    'Всего'
                ],
                columns: [
                    {data: 'index', source: $scope.index, width: 50},
                    {data: 'id', source: $scope.id, width: 50},

                    {data: 'name', type: 'autocomplete', source: $scope.entityNames, strict: false, width: 240},

                    {data: 'workType', width: 130},
                    {type: 'numeric',data: 'workScope', width: 100},
                    {type: 'numeric', data: 'workCost',  width: 220, numericFormat: {pattern: '0.00'}},
                    {type: 'numeric', data: 'workCostAll',  width: 150, numericFormat: {pattern: '0.00'}},

                    {data: 'materialType', width: 180},
                    {type: 'numeric', data: 'materialScope', width: 130},
                    {type: 'numeric',data: 'materialCost',  width: 100, numericFormat: {pattern: '0.00'}},
                    {type: 'numeric', data: 'materialCostAll',  width: 100, numericFormat: {pattern: '0.00'}},


                    {type: 'numeric', data: 'finalCost', width: 80, numericFormat: {pattern: '0.00'}}
                ],
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
                            if (entity) {
                                let isWork = true;
                                $scope.hotInstance.setDataAtCell(row, 1, entity.positionNumber);
                                $scope.hotInstance.setDataAtCell(row, isWork ? 3 : 7, entity.type);
                                $scope.hotInstance.setCellMeta(row, isWork ? 8 : 4, 'readOnly', true);
                                let value = $scope.loadCost(entity);
                                $scope.hotInstance.setDataAtCell(row, isWork ? 5 : 9, value/*.toFixed(2)*/);
                                $scope.hotInstance.setCellMeta(row, 7, 'readOnly', true);
                                $scope.hotInstance.setCellMeta(row, 3, 'readOnly', true);
                                $scope.hotInstance.setCellMeta(row, 5, 'readOnly', true);
                                $scope.hotInstance.setCellMeta(row, 9, 'readOnly', true);
                            }
                        }
                        if (prop === 'workScope'){
                            let cost = $scope.hotInstance.getDataAtCell(row, 5);
                            $scope.hotInstance.setDataAtCell(row, 6,(newValue*cost)/*.toFixed(2)*/);
                            $scope.hotInstance.setDataAtCell(row, 11, (newValue*cost)/*.toFixed(2)*/);
                        }
                        if (prop === 'materialScope'){
                            let cost = $scope.hotInstance.getDataAtCell(row, 9);
                            $scope.hotInstance.setDataAtCell(row, 10, (newValue*cost)/*.toFixed(2)*/);
                            $scope.hotInstance.setDataAtCell(row, 11, (newValue*cost)/*.toFixed(2)*/);
                        }
                    });
                }
            });




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
                toBusinessDate($scope.date, 0);
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
            };

            $scope.del = function() {
                var sel = $scope.hotInstance.getSelected();
                let from = sel[0][0];
                let to = sel[0][2];
                $scope.hotInstance.alter('remove_row', from, 1);
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