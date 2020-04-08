angular.module('viewerCtrl', [])
.controller('viewerController', function($scope, $interval, Booru) {
	var vm = this;

	vm.img_data = Booru.getCurrentImage();

	vm.hasImage = function(){
		if (typeof(vm.img_data.file_name) === "undefined"){
			return false;
		} else {
			return true;
		}
	}

	$scope.$watch('vm.img_data', function(nv, ov){
		if(nv != ov){
			if (vm.hasImage()){
				ppanels = document.getElementsByClassName("pornpanel")
				for (let p of ppanels) {
				   p.setAttribute("src", './assets/img/download/' + vm.img_data.file_name );
				}
			}
		}
	})

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

});
