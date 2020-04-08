var vrBooruApp = angular.module('vrBooruApp', [
	'ngAnimate',
	'app.routes',
	'homeCtrl',
	'viewerCtrl',
	'booruService'
]);

vrBooruApp.directive('backImg', function(){
    return function(scope, element, attrs){
		var url = attrs.backImg;
		console.log(url)
        element.css({
            'background-image': 'url(' + url +')',
			'background-size' : 'cover',
			'background-position' : 'center'
        });
	};
});