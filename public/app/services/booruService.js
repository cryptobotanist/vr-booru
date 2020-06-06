angular.module('booruService', [])
  .factory('Booru', function($http) {
    var booruFactory = {};

    booruFactory.setCurrentImage = function(booruResult) {
      return $http.post('/api/current/image', {booruResult:
        { booru_url: booruResult.booru.domain, file_url: booruResult.file_url,
          file_name: booruResult.data.image, file_encoded: booruResult.base64,
          local_url: "./assets/img/download/" + booruResult.data.image }
      } )
    }

    booruFactory.getCurrentImage = function() {
      return $http.get('/api/current/image')
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
