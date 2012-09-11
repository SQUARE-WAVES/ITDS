var cs = require("./csound.js");
var http = require("http");
var fs = require('fs');
var sfp = require("./sound_from_post.js");
var url = require("url");

var s = http.createServer(function(req,res)
{
	sfp(req,res);
});

s.listen("3000");
