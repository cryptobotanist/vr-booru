angular.module('app.routes', ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider
	// home page route
	.when('/', {
		templateUrl: 'app/views/pages/home.html',
		controller: 'homeController',
		controllerAs: 'home',
		title: 'Search'
	})
	.when('/viewer', {
		templateUrl: 'app/views/pages/viewer.html',
		controller: 'viewerController',
		controllerAs: 'viewer',
		title: 'Viewer'
	})
	.when('/vr', {
		templateUrl: 'app/views/pages/viewer_vr.html',
		controller: 'viewerController',
		controllerAs: 'viewer',
		title: 'VR Viewer'
	})
	// get rid of the hash in the URL
	$locationProvider.html5Mode(true);
});
