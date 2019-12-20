'use strict';

(function () {
    var app = angular.module('app', ['ngRoute', 'ngGrid', 'restangular']);
    app.config(['$routeProvider',
        function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/keywords/partial/editor.html',
            controller: 'KeywordsController'
        });
    }]);
})();