var Imagemin = require("imagemin");


module.exports.focusCrop = function(orig, ops, stream) {
  if (!ops.crop || ops.crop !== "focus") return;

  var heightRatio = ops.height / orig.height;
  var widthRatio = ops.width / orig.width;

  // find the ratio that completely fills the crop frame, but doesn't lose
  // any of the image
  var resizeRatio = heightRatio * orig.width > ops.width
    ? heightRatio
    : widthRatio;

  var resize = {
    width: Math.round(resizeRatio * orig.width),
    height: Math.round(resizeRatio * orig.height),
  };

  var focus = ops.focus || [0.5, 0.5];

  // position crop with focus at the exact center
  var cropPoint = {
    x: Math.round(resize.width * focus[0] - (ops.width / 2)),
    y: Math.round(resize.height * focus[1] - (ops.height / 2)),
  }

  // ensure crop does not overlap low or high edge
  cropPoint.x = Math.min(Math.max(cropPoint.x, 0), resize.width - ops.width);
  cropPoint.y = Math.min(Math.max(cropPoint.y, 0), resize.height - ops.height);

  return stream.resize(resize.width, resize.height)
               .crop(ops.width, ops.height, cropPoint.x, cropPoint.y);
};

module.exports.resizeSoft = function(orig, ops, stream) {
  if (ops.crop) return;

  return stream.resize(ops.width || null, ops.height || null);
};


module.exports.quality = function(orig, ops, stream) {
  if (!ops.quality) return;

  return stream.quality(ops.quality);
};

