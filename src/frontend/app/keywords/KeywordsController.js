'use strict';

(function () {
    let app = angular.module('app');
    app.controller('KeywordsController', function ($scope, RepositoryFactory,
                                                   resolveEntity) {
        $scope.resolveEntity = resolveEntity;
        let KeywordCategoriesRepository = new RepositoryFactory({
            endpoint: 'keywords/categories',
            retrieveItems: function (data) {
                return data._items;
            }
        });

        var KeywordsRepository = new RepositoryFactory({
            endpoint: 'keywords',
            retrieveItems: function (data) {
                return data._items;
            }
        });

        KeywordCategoriesRepository.readAll().then(function(keywordCategories) {
            $scope.keywordCategories = keywordCategories;
            KeywordsRepository.readAll().then(function(keywords) {
                $scope.keywords = keywords;
            });
        });

        $scope.keywordsGridOptions = {
            data: 'keywords',
            enableCellSelection: false,
            enableCellEdit: true,
            keepLastSelected: false,
            enableRowSelection: false,
            multiSelect: false,
            enableSorting: true,
            enableColumnResize: true,
            enableColumnReordering: true,
            showFilter: false,
            rowHeight: '40',
            columnDefs: [{
                field: 'id',
                displayName: 'ID',
                enableCellEdit: false,
                width: '80px'
            }, {
                field: 'value',
                displayName: 'Value',
                editableCellTemplate: 'app/keywords/partial/keywordCellEditor.html'
            }, {
                field: 'categoryID',
                displayName: 'Categories',
                cellTemplate: 'app/keywords/partial/keywordCategoryGridCell.html',
                editableCellTemplate: 'app/keywords/partial/keywordCategoryGridCellEditor.html'
            }, {
                field: '',
                displayName: 'Operations',
                cellTemplate: 'app/keywords/partial/operationsGridCell.html',
                enableCellEdit: false,
                sortable: false
            }
            ]
        };

        $scope.createKeyword = function(newKeyword) {
            $scope.$broadcast('ngGridEventEndCellEdit');
            if (newKeyword.value.length > 0) {
                /* agrega un keyword, y luego de eso updatea los keywords actuales */
                KeywordsRepository.createOne(newKeyword).then(function () {
                    KeywordsRepository.readAll().then(function (keywords) {
                        $scope.keywords = keywords;
                    });
                });
            }
        };

        $scope.updateKeyword = function (keyword) {
            $scope.$broadcast('ngGridEventEndCellEdit');
            KeywordsRepository.updateOne(keyword);
        };

        $scope.deleteKeyword = function (keyword) {
            /* borra el keyword y actualiza los keywords de immediato */
            $scope.$broadcast('ngGridEventCellEdit');
            KeywordsRepository.deleteOne(keyword).then(function () {
                KeywordsRepository.readAll().then(function (keywords) {
                    $scope.keywords = keywords;
                });
            });
        };

        $scope.stopEditingKeywordCategory = function () {
            $scope.$broadcast('ngGridEventEndCellEdit');
        };

        $scope.$on('ngGridEventRows', function (newRows) {
            $scope.$broadcast('ngGridEventEndCellEdit');
        });
    });
})();