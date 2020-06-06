angular.module('headerCtrl', [])
.controller('headerController', function($scope, $location) {
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

    
});