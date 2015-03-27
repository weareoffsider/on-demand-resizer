var crypto = require("crypto");
var path = require("path");
var _ = require("lodash");
var stableStringify = require("json-stable-stringify");

if (!process.browser) {
  var fs = require("fs");
  var gm = require("gm");
  var Imagemin = require("imagemin");
  var mkdirp = require("mkdirp");
}



var progressCache = {};
var doneCache = {};

var flushProgressCache = function(err, hash) {
  if (!progressCache[hash]) return;
  progressCache[hash].forEach(function(cb) { cb(err, hash) });
  delete progressCache[hash];
};


module.exports.resize = function(file, ops, config) {
  var shasum = crypto.createHash("sha1");
  var imgSrc = file.src || file;
  ops.focus = file.focus || ops.focus || null;

  ops.path = imgSrc;
  if (!ops.quality) ops.quality = config.defaultQuality;
  optsString = stableStringify(ops);
  shasum.update(optsString);

  var ext = path.extname(file);
  var hash = shasum.digest("hex");
  var outFile = hash + ext;
  var destUrl = config.urlBase + "/" + outFile;

  if (process.browser) {
    return destUrl;
  }

  // perform actual resize

  var source = config.sourcePath + "/" + ops.path;
  var dest = config.destPath + "/" + outFile;
  if (config.imageMagick) {
    var sizer = gm.subClass({imageMagick: true});
  } else {
    var sizer = gm;
  }

  switch (config.sourceType) {
    case "local":
    fs.readFile(dest, function(err, data) {
      if (err) { // rebuild image
        if (progressCache[hash]) {
          console.log(hash, " :: image in progress, awaiting");
          progressCache[hash].push(function(err, complete) {
            if (err) {
              throw new Error(err);
            } else {
            }
          });
          return;
        } else {
          console.log(hash, " :: image does not exist, rebuild");
          progressCache[hash] = [];
        }

        fs.readFile(source, function(err, data) {
          if (err) {
            console.error("Source image not found :: ", source);
            flushProgressCache(err, hash);
            return;
          }

          var stream = sizer(source);
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
                        throw new Error(err);
                      } else {
                        console.log(hash, " :: image complete");
                      }
                      flushProgressCache(err, hash);
                    });
                  });
                });
            });

          });
        });
      } else { // return url
        console.log(hash, " :: image exists, returning");
      }
    });
    break;

    default:
    console.error("Unsupported source type " + config.sourceType);
    break;
  }

  return destUrl;

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

  var fileNames = instructions.map(function(instruction) {
    return module.exports.resize(imgSrc, instruction, config);
  });

  return fileNames.map(function(name, ix) {
    if (instructions[ix].srcSetBreakpoint) {
      return name + " " + instructions[ix].srcSetBreakpoint + "w";
    } else {
      return name;
    }
  }).join(",");
}
