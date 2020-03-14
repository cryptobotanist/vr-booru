angular.module('homeCtrl', [])
.controller('homeController', function($rootScope, $location, $timeout, Booru) {
	var vm = this;

	vm.query = "";
	vm.imageArray = [];
	vm.imageCount;
	vm.mixMode = false;
	vm.imagesRolling = false;
	vm.selectedImageId = -1;
	vm.selectedSite = null;
	vm.imageCount = 40;
	vm.rollDelay = 5000; // 5 seconds

	vm.availableSites = [
		{name : "Safebooru", short: "sb", explicit: false },
		{name : "Gelbooru", short: "gb", explicit: true },
		{name : "Rule34", short: "r34", explicit: true },
		{name : "RealBooru", short: "rb", explicit: true },
		{name : "TheBigImageBoard", short: "tbib", explicit: true },
	]

	var rollImages = function(){
		$timeout(function() {
			if (vm.imagesRolling){
				if ((vm.selectedImageId + 1) % vm.imageCount == 0){
					if (vm.mixMode){
						vm.localRemix();
					} else {
						vm.searchImages();
					}
					vm.selectedImageId = 0;
					vm.imagesRolling = true;
				} else {
					vm.selectedImageId = (vm.selectedImageId + 1) % vm.imageCount;
				}
				Booru.setCurrentImage(vm.imageArray[vm.selectedImageId]);
			}
			rollImages();
		}, vm.rollDelay)
	};

	vm.fixUrl = function(url){
		return Booru.fixUrl(url);
	}

	vm.localUrl = function(name){
		return Booru.localUrl(name) + '?decache=' + Date.now() ;
	}

	vm.searchImages = function(event) {
		event.preventDefault();
		vm.mixMode = false;
		resetRollImages();
		Booru.searchBooru(vm.selectedSite.short, vm.query, vm.imageCount, vm.selectedSite.explicit)
			.then(function(ret){
				console.log("SEARCHED")
				vm.imageArray = ret.data;
				vm.imageCount = ret.data.length;
			})
	}

	vm.localRemix = function(event) {
		vm.mixMode = true;
		resetRollImages();
		Booru.localMix(vm.imageCount)
			.then(function(ret){
				console.log("REMIXED")
				vm.imageArray = ret.data;
				vm.imageCount = ret.data.length;
			})
	}

	vm.setCurrentImage = function(image_id) {
		resetRollImages();
		vm.selectedImageId = image_id;
		Booru.setCurrentImage(vm.imageArray[image_id]);
		vm.imagesRolling = true;
	}

	var resetRollImages = function(){
		vm.selectedImageId = -1;
		vm.imagesRolling = false;
	}

	rollImages();

});
