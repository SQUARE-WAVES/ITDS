//a controller that creates a sound file from an orc and sco file in a POST from a form
var cs = require("./csound.js");
var qs = require("querystring");
var fs = require("fs");

module.exports = function(req,res)
{

	if(req.method != 'POST')
	{
		res.end("post's only dude");
		return;
	}

	var csound = cs.new_csound();
	var body = "";
	req.setEncoding("utf8");
	
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

			csound.render_sound(process.stdout,function(err,outpath)
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

				outread.on("end",function()
				{
					csound.clean_files(function(err)
					{
						if(err)
						{
							throw err;
						}
					});
				});
			});
		});
	});
}
