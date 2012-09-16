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

			csound.clean_files(function(err)
			{
				if(err)
				{
					throw err;
				}
			})
		});

	});
});
