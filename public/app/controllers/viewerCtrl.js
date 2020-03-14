angular.module('viewerCtrl', [])
.controller('viewerController', function($rootScope, $location, $timeout, Booru) {
	var vm = this;

	var setReferrer = function(referrer){
		delete window.document.referrer;
		window.document.__defineGetter__('referrer', function () {
				return referrer;
		});
	}

	vm.img_data;

	vm.getCurrentImage = function(){
		Booru.getCurrentImage()
			.then(function(ret){
				//setReferrer(ret.data.booru_url);
				vm.img_data = ret.data;
				vm.img_data.file_url = vm.img_data.file_url.replace('/images', '//images');
				ppanels = document.getElementsByClassName("pornpanel")
				for (let p of ppanels) {
				   p.setAttribute("src", './assets/img/download/' + vm.img_data.file_name );
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



	var viewerRefresh = function(){
		$timeout(function() {
			vm.getCurrentImage();
			viewerRefresh();
		}, 3000)
	};

	viewerRefresh();

});
