var cs = require("../csound.js");
var rends = require("../render_jam.js");
var cc = require("../couch_connector.js");

cc.get_jam("jambor",function(jam)
{
	csound =cs.new_csound();
	csound.write_files(rends.render_orc(jam),rends.render_sco(jam.tracks[0]),function(err)
	{
		if(err)
		{
			throw err;
		}

		csound.render_sound(process.stdout,function(err)
		{
			if(err)
			{
				throw err;
			}
	
			console.log("ITS FINISHED");

			cc.attach_sound(jam._id,jam._rev,csound.outfile,jam.tracks[0].name+".wav",function(res)
			{
				var resbod = "";
				res.on('data',function(chunk)
				{
					resbod +=chunk;
				});

				res.on('end',function()
				{
					console.log(resbod);
					csound.clean_files(function()
					{
					});
				});
			});
		});
	});
});
