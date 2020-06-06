angular.module('homeCtrl', [])
.controller('homeController', function($scope, Booru) {
	var vm = this;

	vm.booruService = Booru;
	vm.imageArray = Booru.getCurrentSearchResult();
	vm.selectedImageId = Booru.getCurrentImageId();
	vm.mixMode = Booru.isMixMode();
	vm.imagesRolling = Booru.isRolling();
	vm.rollDelay = Booru.getRollDelay();
	vm.query = Booru.getCurrentQuery();
	vm.selectedSite = Booru.getCurrentSelectedSite();
	vm.imageCount = Booru.getCurrentImageCount();

	vm.availableSites = [
		{name : "Safebooru", short: "sb", explicit: false },
		{name : "Gelbooru", short: "gb", explicit: true },
		{name : "Rule34", short: "r34", explicit: true },
		{name : "RealBooru", short: "rb", explicit: true },
		{name : "TheBigImageBoard", short: "tbib", explicit: true },
	]

	$scope.$watch(function () { return Booru.getCurrentImageId() },
		function (value) { vm.selectedImageId = value;}
	);

	$scope.$watch(function () { return Booru.getCurrentSearchResult() },
		function (value) { vm.imageArray = value; }
	);

	if (vm.selectedSite != null){
		vm.selectedSiteIndex = vm.availableSites.findIndex(element => element.name == vm.selectedSite.name);
	} else {
		vm.selectedSiteIndex = 0;
	}

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
			Booru.setMixMode(false);
			resetRollImages();
			vm.imageArray = [];
			Booru.setCurrentSelectedSite(vm.selectedSite);
			Booru.setCurrentQuery(vm.query);
			Booru.setCurrentImageCount(vm.imageCount);
			Booru.searchBooru(vm.selectedSite.short, vm.query, vm.imageCount, vm.selectedSite.explicit).then(
				function(ret){
					vm.imageArray = ret.data;
					Booru.setCurrentSearchResult(vm.imageArray);
				})
		}
	}

	vm.doLocalRemix = function(event){
		event.preventDefault();
		localRemix();
	}

	localRemix = function() {
		vm.mixMode = true;
		Booru.setMixMode(true);
		Booru.setCurrentImageCount(vm.imageCount);
		Booru.setCurrentSelectedSite(vm.selectedSite);
		Booru.setCurrentQuery(vm.query);
		resetRollImages();
		vm.imageArray = [];
		Booru.localMix(vm.imageCount).then(
			function(ret){
				vm.imageArray = ret.data;
				Booru.setCurrentSearchResult(vm.imageArray);
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
		Booru.setCurrentImageId(vm.selectedImageId);
		vm.imagesRolling = false;
		Booru.setRolling(false);
	}

	vm.toggleRolling = function(event){
		vm.imagesRolling = !vm.imagesRolling;
		if(vm.selectedImageId == -1){
			vm.selectedImageId = 0;
			Booru.setCurrentImageId(vm.selectedImageId);
		}
		Booru.setRollDelay(vm.rollDelay);
		Booru.setRolling(vm.imagesRolling);
	}

});
