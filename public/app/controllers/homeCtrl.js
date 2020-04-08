angular.module('homeCtrl', [])
.controller('homeController', function($scope, $interval, Booru) {
	var vm = this;

	vm.query = "";
	vm.imageArray = Booru.getCurrentSearchResult();
	vm.selectedImageId = Booru.getCurrentImageId();
	vm.mixMode = false;
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
					Booru.setCurrentSearchResult(ret.data);
				});
		}
	}

	vm.doLocalRemix = function(event){
		event.preventDefault();
		localMix();
	}

	localRemix = function() {
		vm.mixMode = true;
		resetRollImages();
		vm.imageArray = [];
		Booru.localMix(vm.imageCount)
			.then(function(ret){
				console.log("REMIXED")
				vm.imageArray = ret.data;
				Booru.setCurrentSearchResult(ret.data);
			})
	}

	vm.doSetCurrentImage = function(event, image_id){
		resetRollImages();
		setCurrentImage(image_id);
	}

	setCurrentImage = function(image_id) {
		vm.selectedImageId = image_id;
		Booru.setCurrentImage(vm.imageArray[image_id]);
		Booru.setCurrentImageId(image_id);
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

});
