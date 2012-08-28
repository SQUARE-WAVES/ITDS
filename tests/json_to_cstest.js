var fs = require("fs");
var renderer = require("../json_to_csound");

function getJSON(callback)
{
	fs.readFile("../testdata/csjson.js",callback);
}

getJSON(function(err,data)
{
	if(err)
	{
		console.log("shit's whack");
		return;
	}

	var jam = JSON.parse(data);

	console.log(renderer.render_setup(jam));
	console.log(renderer.render_globals(jam));
	console.log(renderer.render_instrs(jam));
});
