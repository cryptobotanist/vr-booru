angular.module('booruService', [])
  .factory('Booru', function($http, $interval) {
    var booruFactory = {};

    var currentImageId = -1;
    var currentSearchResult = [];
    var currentImage = {};
    var rolling = false;
    var rollDelay = 3;
    var mixMode = false;
    var rollInterval;
    var currentImageCount = 10;
    var currentQuery = "";
    var currentSelectedSite = null;

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

    booruFactory.isRolling = function(){
      return rolling;
    }

    booruFactory.setRolling = function(roll){
      rolling = roll;
      if (roll){
        rollInterval = $interval(rollImage, rollDelay*1000)
      } else {
        $interval.cancel(rollInterval);
      }
    }

    var rollImage = function(){
      if (rolling){
        booruFactory.shiftImage(1);
      }
    };

    booruFactory.shiftImage = function(delta){
      if ((currentImageId + delta) % currentSearchResult.length <= 0 && (currentImageId + delta) != 0){
        if((currentImageId + delta) % currentSearchResult.length == 0){
          currentImageId = 0;
        } else {
          currentImageId = currentSearchResult.length-1;
        }
        if (mixMode){
          console.log("REMIXING FROM SERVICE")
          booruFactory.localMix(currentImageCount).then(function(ret){ booruFactory.setCurrentSearchResult(ret.data);
            booruFactory.setCurrentImage(currentSearchResult[currentImageId]);
            booruFactory.setCurrentImageId(currentImageId);})
        } else {
          console.log("RESEARCHING FROM SERVICE")
          booruFactory.searchBooru(currentSelectedSite.short, currentQuery, currentImageCount, currentSelectedSite.explicit)
            .then(function(ret){ booruFactory.setCurrentSearchResult(ret.data);
              booruFactory.setCurrentImage(currentSearchResult[currentImageId]);
              booruFactory.setCurrentImageId(currentImageId);})
        }
      } else {
        currentImageId = (currentImageId + delta) % currentSearchResult.length;
        booruFactory.setCurrentImage(currentSearchResult[currentImageId]);
        booruFactory.setCurrentImageId(currentImageId);
      }
      
    }

    booruFactory.getRollDelay = function(){
      return rollDelay;
    }

    booruFactory.setRollDelay = function(delay){
      rollDelay = delay;
    }

    booruFactory.isMixMode = function(){
      return mixMode;
    }

    booruFactory.setMixMode = function(mix){
      mixMode = mix;
    }

    booruFactory.getCurrentQuery = function(){
      return currentQuery
    }

    booruFactory.setCurrentQuery = function(query){
      currentQuery = query;
    }

    booruFactory.getCurrentImageCount = function(){
      return currentImageCount;
    }

    booruFactory.setCurrentImageCount = function(imageCount){
      currentImageCount = imageCount;
    }

    
    booruFactory.getCurrentSelectedSite = function(){
      return currentSelectedSite;
    }

    booruFactory.setCurrentSelectedSite = function(site){
      currentSelectedSite = site;
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

    booruFactory.deleteImages = function(passphrase){
      return $http.post('/api/images/clear', {'passphrase' : passphrase})
    }

    return booruFactory;
  })
