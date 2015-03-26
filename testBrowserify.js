var OnDemandResizer = require("./index.js");

var resizer = OnDemandResizer({
  sourceType: "local",
  sourcePath: "",
  destType: "local",
  destPath: "" + "/outputtest",
  urlBase: "/uploads",
  defaultQuality: 80
});

var renderImage = function(ops) {
  return resizer.resize("test.jpg", ops);
}

console.log(renderImage({width: 300, height: 300}));
