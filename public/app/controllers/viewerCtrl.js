angular.module('viewerCtrl', [])
.controller('viewerController', function($scope, $interval, Booru) {
	var vm = this;

	vm.img_data = {};

	vm.hasImage = function(){
		if (typeof(vm.img_data.file_name) === "undefined"){
			return false;
		} else {
			return true;
		}
	}

	vm.getCurrentImage = function(){
		Booru.getCurrentImage()
			.then(function(ret){
				vm.img_data = ret.data;
				if (vm.hasImage()){
					ppanels = document.getElementsByClassName("pornpanel")
					for (let p of ppanels) {
					   p.setAttribute("src", './assets/img/download/' + vm.img_data.file_name );
					}
				}
			})
	}

	document.addEventListener('keypress', (event) => {
	  const keyName = event.key;
		panel = document.getElementById("panel-6")
		console.log( panel.getAttribute("rotation"));
		rotation = panel.getAttribute("rotation")
	  switch(keyName) {
			case "x":
				rotation.x = (rotation.x + 5) % 360
				break;
			case "c":
				rotation.y = (rotation.y + 5) % 360
				break;
			case "v":
				rotation.z = (rotation.z + 5) % 360
				break;
		}
		document.getElementById("panel-6").setAttribute("rotation", rotation)
	});

	refreshImgInterval = $interval(vm.getCurrentImage, 1000);

	$scope.$on("$destroy", function(){
        $interval.cancel(refreshImgInterval);
    });

});
