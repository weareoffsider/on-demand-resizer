var strategies = require("./strategies.js");
var api = require("./api.js");
var _ = require("lodash");


module.exports = function(config) {
  var config = _.merge({
    sourceType: "local",
    sourcePath: __dirname,
    destType: "local",
    destPath: __dirname,
    urlBase: "/",
    defaultQuality: null,
    pipeline: [
      strategies.focusCrop,
      strategies.resizeSoft,
      strategies.quality,
    ]
  }, config);

  return {
    resize: function(file, ops) { return api.resize(file, ops, config); },
    srcset: function(image, sizes) { return api.srcset(image, sizes, config); }
  }
}
