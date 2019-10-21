var strategies = require("./strategies.js");
var api = require("./api.js");

if (typeof window == "undefined") {
  var ImageminGifsicle = require("imagemin-gifsicle");
  var ImageminJpegtran = require("imagemin-jpegtran");
  var ImageminMozJpeg = require("imagemin-mozjpeg");
  var ImageminSvgo = require("imagemin-svgo");
  var ImageminOptipng = require("imagemin-optipng");
}


module.exports = function(config) {
  var config = Object.assign({
    sourceType: "local",
    sourcePath: __dirname,
    destType: "local",
    destPath: __dirname,
    urlBase: "/",
    defaultQuality: null,
    workers: 5,
    imageminPlugins: typeof window == "undefined" 
      ? [
          ImageminGifsicle({interlaced: true}),
          ImageminMozJpeg(),
          ImageminSvgo(),
          ImageminOptipng({optimizationLevel: 3}),
        ]
      : [],
    pipeline: [
      strategies.focusCrop,
      strategies.resizeSoft,
      strategies.quality,
    ]
  }, config)

  return {
    resize: function(file, ops) { return api.resize(file, ops, config); },
    srcset: function(image, sizes) { return api.srcset(image, sizes, config); }
  }
}
