var vrBooruApp = angular.module('vrBooruApp', [
	'ngAnimate',
	'app.routes',
	'rzSlider',
	'headerCtrl',
	'homeCtrl',
	'viewerCtrl',
	'booruService'
]);

vrBooruApp.directive('imageloaded', [
    function () {
        'use strict';
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
				element.addClass("img-loading");
                var origSrc,
                    timeout;
                function reload() {
                    timeout = setTimeout(function() {
                        if (!origSrc) {
                            origSrc = element[0].src;
                        }
                        element[0].src = origSrc + '?' + Date.now();
                        reload();
                    }, 500);
                }
                reload();
                element.bind('load', function (e) {
					clearTimeout(timeout);
					element.removeClass("img-loading");
					element.addClass("img-loaded");
                });
            }
        }
    }
]);

vrBooruApp.run(['$rootScope', '$route', function($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function() {
        document.title = "VR Booru » " + $route.current.title;
    });
}]);