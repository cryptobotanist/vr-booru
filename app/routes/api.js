var config = require('../../config')
var Booru 	= require('booru');
var request = require('request');
var downloader = require('image-downloader');
var fs = require('fs');

var fixUrl = function(url){
	return url.replace('/images', '//images')
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function encodeImage(url) {
  return new Promise((resolve, reject) => {
    request({url: fixUrl(url), encoding:null}, (error, response, body) => {
      if (error) reject(error);
      if (response.statusCode != 200) {
          reject('Invalid status code <' + response.statusCode + '>');
      }
      var base64prefix = 'data:' + response.headers['content-type'] + ';base64,'
          , image = body.toString('base64');
      if (typeof callback == 'function') {
          callback(image, base64prefix);
      }
      data = {'img': image, 'prefix': base64prefix}
      resolve(data);
    });
  });
}

async function processImages(images) {
  currentImages = []
  for (let image of images) {
      enc_img = await encodeImage(image.file_url)
      image.base64 = enc_img.prefix + enc_img.img;
      console.log("pushing new image!" + enc_img.prefix)
      currentImages.push(image);
    }
  console.log("Finished processing!")
  return currentImages;
}

async function fastProcessImages(images) {
  currentImages = []
  for (let image of images) {
      image.base64 = ""
      image.hasLoaded = false
      currentImages.push(image);
    }
  return currentImages;
}

async function downloadIMG(url, dest) {
  try {
    const { filename, image } = await downloader.image({url: url, dest: dest});
    console.log(filename) // => /path/to/dest/image.jpg
  } catch (e) {
    console.error(e)
  }
}

// Waiting for all images to being processed (i.e. transformed to base64)
// is very slow. Search first, process later?
// 1. Quick search to get some preliminary results (use dummy thumbnail)
// 2. Once done searching, start processing images and adding their base64
//    version to the result object. (Use a flag to know when to use dummy or true)

module.exports = function(app, express) {
  var apiRouter = express.Router();

  apiRouter.get('/', function(req, res) {
  	res.json({message: "let's get some booties"});
  });

  apiRouter.route('/current/image')
    .post(function(req, res) {
      global.currentImage = req.body.booruResult;
      res.json({ "success" : true });
    })
    .get(function(req, res) {
      res.json(global.currentImage)
    });

  apiRouter.get('/remix', function(req, res){
    const limit = parseInt(req.query.limit);
    fs.readdir('./public/assets/img/download/', (err, files) => {
    shuffleArray(files);
    ret = [];
    var subfiles = files.slice(0, limit);
    subfiles.forEach(file => {
        obj = {_data: {image: file}, booru: {domain: "local"}, file_url: "./assets/img/download"+file};
        ret.push(obj);
      });
    res.json(ret);
    })

  })

  apiRouter.get('/search/:site/:tags', function(req, res){
  			tags = req.params.tags.split(',');
  			site = req.params.site;
        limit = parseInt(req.query.limit) || 10;
        tags.push('-webm');
        tags.push('-furry');
        tags.push('-lolicon');
        tags.push('-shotacon');

        Booru.search(site, tags, {limit: limit, random: true})
        .then( async function(images){
          processedImages = await fastProcessImages(images);
          processedImages.forEach( pimg => {
						console.log(fixUrl(pimg._data.file_url))
            downloadIMG(fixUrl(pimg._data.file_url), './public/assets/img/download/')
          });
          console.log("DONE PROCESSING!")
          res.json(processedImages);
        })
        .catch(err => {
          if (err.name === 'BooruError') {
            //It's a custom error thrown by the package
            console.log(err.message)
          } else {
            //This means I messed up. Whoops.
            console.log(err)
          }
        })
  	});

  return apiRouter;
};
