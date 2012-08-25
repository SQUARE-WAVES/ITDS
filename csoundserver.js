var cs = require("./csound.js");
var qs = require("querystring");
var http = require("http");
var fs = require('fs');

/*
var s = http.createServer(function(req,res)
{
	var fpath = 'tmp/tmp.sco'
	var sco_buffer = ""
	var file;
	
	req.on('data',function(chunk)
	{
		//basically buffer up the datas
		//we are assuming a string
		sco_buffer += chunk; 
	});

	req.on("end",function()
	{
		function do_csound()
		{
			cs.go('simple.orc',fpath,'servtest.wav',process.stdout,function(code)
			{
				if(code != 0)
				{
					res.end("csound error");
				}
				else
				{
					res.end("it's all good");

				}
			});
		}
		console.log("SCORE",sco_buffer);
		console.log("--------------------------------------");
		file = fs.createWriteStream(fpath);
		file.end(sco_buffer,'utf8');
		do_csound();

	});
});
*/

var s = http.createServer(function(req,res)
{

	var csound = cs.create_csound();
	var body = "";
	req.on('data',function(chunk)
	{
		body += chunk;
	});

	req.on('end',function()
	{
		var obj = qs.decode(decodeURIComponent(body));
		var orc = obj.orc;
		var sco = obj.sco;

		csound.write_files(orc,sco,function(err)
		{
			console.log("writing files");
			if(err)
			{
				res.end("shit's fucked up");
				return;
			}

			csound.go(function(err,outpath)
			{
				console.log("running csound");
				if(err)
				{
					res.end("shit's fucked up");
					return;
				}
				
				outread = fs.createReadStream(outpath);
				res.setHeader("Content-Type","audio/wav");
				res.setHeader("Content-Disposition","attachment; filename=\"sound.wav\"");
				outread.pipe(res);

			});
		});
	});
});

s.listen("12345");
