angular.module('viewerCtrl', [])
.controller('viewerController', function($scope, Booru) {
	var vm = this;
	vm.img_data = Booru.getCurrentImage();

	isEmptyObject = function(obj){
		return (Object.keys(obj).length === 0 && obj.constructor === Object)
	}

	vm.hasImage = function(){
		if (isEmptyObject(vm.img_data)){
			return false;
		} else {
			return true;
		}
	}

	vm.shiftImage = function(delta){
		Booru.shiftImage(delta);
		
	}

	var keyMove = function(event){
		const keyName = event.key;
	  	switch(keyName) {
			case "x":
				vm.shiftImage(-1);
				break;
			case "c":
				vm.shiftImage(1);
				break;
			case " ":
				vm.shiftImage(1);
				break;
		}
		$scope.$apply();
	}

	$scope.$watch(function () { return Booru.getCurrentImage() },
		function (value) {
			if (!isEmptyObject(value)){
				vm.img_data = Booru.getCurrentImage();
				if (vm.hasImage()){
					ppanels = document.getElementsByClassName("pornpanel")
					for (let p of ppanels) {
					p.setAttribute("src", './assets/img/download/' + vm.img_data.file_name );
					}
				}
			}
		}
	);

	$scope.$watch(function () { return Booru.getCurrentImageId() },
		function (value) { 
				vm.img_data = Booru.getCurrentImage();
				if (vm.hasImage()){
					ppanels = document.getElementsByClassName("pornpanel")
					for (let p of ppanels) {
					p.setAttribute("src", './assets/img/download/' + vm.img_data.file_name );
					}
				}
			}
	);

	document.addEventListener('keypress', keyMove);

	$scope.$on("$destroy", function() {
		document.removeEventListener('keypress', keyMove);
    });

});
