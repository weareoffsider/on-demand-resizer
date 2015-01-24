var Promise = require("promise");
var gm = require("gm");
var redis = require("redis");
var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
var Promise = require("promise");
var async = require("async");
var Imagemin = require("imagemin");
var mkdirp = require("mkdirp");
var _ = require("lodash");


module.exports.resize = function(file, ops, config) {
  return new Promise(function(resolve, reject) {

    var shasum = crypto.createHash("sha1");

    var imgSrc = file.src || file;
    ops.focus = file.focus || ops.focus || null;

    ops.path = imgSrc;
    if (!ops.quality) ops.quality = config.defaultQuality;
    optsString = JSON.stringify(ops);
    shasum.update(optsString);

    var ext = path.extname(file);
    var hash = shasum.digest("hex");
    var outFile = hash + ext;
    var dest = config.destPath + "/" + outFile;
    var destUrl = config.urlBase + "/" + outFile;

    switch (config.sourceType) {
      case "local":
      fs.readFile(dest, function(err, data) {
        if (err) { // rebuild image
          console.log(optsString, " :: image does not exist, rebuild");

          var stream = gm(config.sourcePath + "/" + ops.path);
          stream = stream.autoOrient().noProfile();
          stream.size(function(err, orig) {
            for (var i = 0; i < config.pipeline.length; i++) {
              var stage = config.pipeline[i];
              var result = stage(orig, ops, stream);
              if (result) {
                stream = result;
              }
            }

            stream.toBuffer(function(err, image) {
              var imgmin = new Imagemin()
                .src(image)
                .use(Imagemin.gifsicle({interlaced: true}))
                .use(Imagemin.jpegtran({progressive: true}))
                .use(Imagemin.svgo())
                .use(Imagemin.optipng({optimizationLevel: 3}))
                .run(function(err, files) {
                  mkdirp(path.dirname(dest), function(err) {
                    if (err) { reject(err) };

                    fs.writeFile(dest, files[0].contents, function(err) {
                      if (err) {
                        reject(err)
                      } else {
                        resolve(destUrl);
                      }
                    });
                  });
                });
            });

          });
        } else { // return url
          console.log(optsString, " :: image exists, returning");

          resolve(destUrl);
        }
      });
      break;

      default:
      console.error("Unsupported source type " + config.sourceType);
      reject(true);
    }

  });
}




module.exports.srcset = function(image, sizes, config) {
  var imgSrc = image.src || image;
  var focus = image.focus || [0.5, 0.5];

  var instructions = sizes.split(",").map(function(size) {
    var xyWidth = size.split(":");
    var dimensions = xyWidth[0].split("x");
    var breakpoint = xyWidth[1] ? parseInt(xyWidth[1]) : null;
    var size = {
      x: parseInt(dimensions[0]),
      y: dimensions[1] ? parseInt(dimensions[1]) : null
    };

    return {
      width: size.x,
      height: size.y,
      srcSetBreakpoint: breakpoint,
      crop: size.y ? "focus" : null,
      focus: focus
    };
  });

  resizePromises = instructions.map(function(instruction) {
    return module.exports.resize(imgSrc, instruction, config);
  });

  return Promise.all(resizePromises).then(function(fileNames) {
    return fileNames.map(function(name, ix) {
      if (instructions[ix].srcSetBreakpoint) {
        return name + " " + instructions[ix].srcSetBreakpoint + "w";
      } else {
        return name;
      }
    }).join(",");
  });
}
