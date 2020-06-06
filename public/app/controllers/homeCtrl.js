angular.module('homeCtrl', [])
.controller('homeController', function($scope, $interval, Booru) {
	var vm = this;

	vm.query = "";
	vm.imageArray = [];
	vm.imageCount;
	vm.mixMode = false;
	vm.imagesRolling = false;
	vm.selectedImageId = -1;
	vm.selectedSite = null;
	vm.imageCount = 10;
	vm.rollDelay = 5;

	vm.availableSites = [
		{name : "Safebooru", short: "sb", explicit: false },
		{name : "Gelbooru", short: "gb", explicit: true },
		{name : "Rule34", short: "r34", explicit: true },
		{name : "RealBooru", short: "rb", explicit: true },
		{name : "TheBigImageBoard", short: "tbib", explicit: true },
	]

	vm.imageCountSliderOptions = {
		floor: 5,
		ceil: 30,
		step: 5,
		showTicks: true,
		translate: function(value) {
			return 'Load ' + value + ' images';
		}
	}

	vm.delaySliderOptions = {
		floor: 1,
		ceil: 10,
		step: 1,
		showTicks: true,
		translate: function(value) {
			return value + ' s';
		}
	}

	vm.getDefaultImg = function() {
		return "/assets/img/dummy.png"
	}

	var rollImage = function(){
		if (vm.imagesRolling){
			if ((vm.selectedImageId + 1) % vm.imageArray.length == 0){
				if (vm.mixMode){
					localRemix();
				} else {
					searchImages();
				}
				vm.selectedImageId = 0;
				vm.imagesRolling = true;
			} else {
				vm.selectedImageId = (vm.selectedImageId + 1) % vm.imageArray.length;
			}
			Booru.setCurrentImage(vm.imageArray[vm.selectedImageId]);
		}
	};

	vm.fixUrl = function(url){
		return Booru.fixUrl(url);
	}

	vm.localUrl = function(name){
		return Booru.localUrl(name);
	}

	vm.doSearchImages = function(event){
		event.preventDefault();
		searchImages();
	}

	searchImages = function() {
		if(vm.query != ""){
			console.log("SEARCHING");
			vm.mixMode = false;
			resetRollImages();
			vm.imageArray = [];
			Booru.searchBooru(vm.selectedSite.short, vm.query, vm.imageCount, vm.selectedSite.explicit)
				.then(function(ret){
					console.log("SEARCHED")
					vm.imageArray = ret.data;
				});
		}
	}

	vm.doLocalRemix = function(event){
		event.preventDefault();
		localRemix();
	}

	localRemix = function() {
		vm.mixMode = true;
		resetRollImages();
		vm.imageArray = [];
		Booru.localMix(vm.imageCount)
			.then(function(ret){
				console.log("REMIXED")
				vm.imageArray = ret.data;
			})
	}

	vm.setCurrentImage = function(image_id) {
		resetRollImages();
		vm.selectedImageId = image_id;
		Booru.setCurrentImage(vm.imageArray[image_id]);
	}

	var resetRollImages = function(){
		vm.selectedImageId = -1;
		vm.imagesRolling = false;
	}

	vm.startRolling = function(event){
		vm.imagesRolling = true;
	}

	vm.stopRolling = function(event){
		vm.imagesRolling = false;
	}

	rollImgInterval = $interval(rollImage, vm.rollDelay*1000);

	$scope.$on("$destroy", function(){
        $interval.cancel(rollImgInterval);
    });
});
