angular.module('headerCtrl', [])
.controller('headerController', function($scope, $location, Booru) {
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

    $scope.deleteImages = function ($event) { 
        var password = prompt("Delete local images? Enter Password", "");
        Booru.deleteImages(password).then(function(ret){
            msg = ret.data;
            if(msg.success){
                alert("All images deleted");
            } else {
                alert("Wrong Password!");
            }
        })
    };

    
});