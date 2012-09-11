var ss = require("../static_server.js");
var http = require("http");
var url = require("url");

var thiss = ss.create_static_server("/static/","/home/the-h/csounds/static/");
http.createServer(function(req,res)
{
	var parsed = url.parse(req.url);
	if(parsed.path.substring(0,8) == '/static/')
	{
		thiss.serve(parsed.path,res);
	}
	else
	{
		res.end("can't find it");
	}
}).listen(3000);

