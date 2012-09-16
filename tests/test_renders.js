var fs = require("fs");
var rends = require("../render_jam.js");

var test_jam = fs.readFileSync("../testdata/testlist.js");
test_jam = JSON.parse(test_jam).jambor;

console.log("SETUP")
console.log(rends.render_setup(test_jam.setup));
console.log("-----");

console.log("ORC")
console.log(rends.render_orc(test_jam));
console.log("-----");

console.log("sco")
console.log(rends.render_sco(test_jam.tracks[0]));
console.log("-----");

