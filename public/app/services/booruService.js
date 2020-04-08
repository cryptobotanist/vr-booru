angular.module('booruService', [])
  .factory('Booru', function($http) {
    var booruFactory = {};

    var currentImageId = -1;
    var currentSearchResult = [];
    var currentImage = {};

    // TODO: Leave UI stuff here but handle search and roll on Service
    // We will receive updates here through bindings, and will operate the Service through here
    // but the service will be re-searching and rolling the data on it's own
    // so we can go to another tab and keep receiving updates there
    // Also try to track timeout on a progress bar on the viewer or smth

    availableSites = [
      {name : "Safebooru", short: "sb", explicit: false },
      {name : "Gelbooru", short: "gb", explicit: true },
      {name : "Rule34", short: "r34", explicit: true },
      {name : "RealBooru", short: "rb", explicit: true },
      {name : "TheBigImageBoard", short: "tbib", explicit: true },
    ]

    booruFactory.setCurrentImage = function(booruResult) {
      currentImage =
        { booru_url: booruResult.booru.domain, file_url: booruResult.file_url,
          file_name: booruResult.data.image, file_encoded: booruResult.base64,
          local_url: "./assets/img/download/" + booruResult.data.image }
    }

    booruFactory.getCurrentImage = function() {
      return currentImage;
    }

    booruFactory.setCurrentSearchResult = function(searchResult) {
      currentSearchResult = searchResult;
    }

    booruFactory.getCurrentSearchResult = function(){
      return currentSearchResult;
    }

    booruFactory.setCurrentImageId = function(id){
      currentImageId = id;
    }

    booruFactory.getCurrentImageId = function(){
      return currentImageId;
    }

    booruFactory.searchBooru = function(site, tags, limit, explicit) {
      if (explicit){
        tags += ",rating:explicit"
      }
      return $http.get('/api/search/'+site+'/'+tags+'?limit='+limit)
    }

    booruFactory.localMix = function(limit) {
      return $http.get('/api/remix?limit='+limit)
    }

    booruFactory.fixUrl = function(url){
      return url.replace('/images', '//images')
    }

    booruFactory.localUrl = function(name){
      return "./assets/img/download/" + name;
    }

    booruFactory.loadBase64Image = function (url, callback) {
      // Required 'request' module
      var request = require('request');
      // Make request to our image url
      // Request client-side?

      request({url: fixUrl(url), encoding: null}, function (err, res, body) {
          if (!err && res.statusCode == 200) {
              // So as encoding set to null then request body became Buffer object
              var base64prefix = 'data:' + res.headers['content-type'] + ';base64,'
                  , image = body.toString('base64');
              if (typeof callback == 'function') {
                  callback(image, base64prefix);
              }
          } else {
              throw new Error('Can not download image');
          }
      });
    };

    return booruFactory;
  })
