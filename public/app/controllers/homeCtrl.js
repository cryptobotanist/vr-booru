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

	vm.availableSites = [
		{name : "Gelbooru", short: "gb" },
		{name : "Rule34", short: "r34" },
		{name : "RealBooru", short: "rb" },
		{name : "TheBigImageBoard", short: "tbib" },
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
		}, 6000)
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
		Booru.searchBooru(vm.selectedSite.short, vm.query, 40, true)
			.then(function(ret){
				console.log("SEARCHED")
				vm.imageArray = ret.data;
				vm.imageCount = ret.data.length;
			})
	}

	vm.localRemix = function(event) {
		vm.mixMode = true;
		Booru.localMix(40)
			.then(function(ret){
				console.log("REMIXED")
				vm.imageArray = ret.data;
				vm.imageCount = ret.data.length;
			})
	}

	vm.setCurrentImage = function(image_id) {
		vm.selectedImageId = -1;
		vm.imagesRolling = false;
		vm.selectedImageId = image_id;
		Booru.setCurrentImage(vm.imageArray[image_id]);
		vm.imagesRolling = true;
	}

	rollImages();

});
