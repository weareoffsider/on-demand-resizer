var OnDemandResizer = require("./index.js");
var thenJade = require("then-jade");


var resizer = OnDemandResizer({
  sourceType: "local",
  sourcePath: __dirname,
  destType: "local",
  destPath: __dirname + "/outputtest",
  urlBase: "/uploads",
  imageMagick: true,
  defaultQuality: 80,
});


// resizer.resize("test.jpg", {
//   height: 450,
//   width: 300
// }).then(function(resultLocation) {
//   console.log(resultLocation);
  
// });

var renderImage = function(ops) {
  return resizer.resize("test.jpg", ops);
}

thenJade.renderFile("async-test.jade", {
  srcset: resizer.srcset,
  renderImage: renderImage
}, function(err, result) {
  console.log(err, result);
});
