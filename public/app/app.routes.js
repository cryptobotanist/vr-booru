angular.module('app.routes', ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider
	// home page route
	.when('/', {
		templateUrl: 'app/views/pages/home.html',
		controller: 'homeController',
		controllerAs: 'home'
	})
	.when('/viewer', {
		templateUrl: 'app/views/pages/viewer.html',
		controller: 'viewerController',
		controllerAs: 'viewer'
	})
	.when('/vr', {
		templateUrl: 'app/views/pages/viewer_vr.html',
		controller: 'viewerController',
		controllerAs: 'viewer'
	})
	// get rid of the hash in the URL
	$locationProvider.html5Mode(true);
});
