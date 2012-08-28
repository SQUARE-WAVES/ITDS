var cs = require("../csound.js");
var fs = require("fs");

var sounder = cs.new_csound();
var orctext;
var scotext;

function get_texts(callback)
{
	var scodone = false;
	var orcdone = false;
	var errs = false;

	function check()
	{
		if(orcdone && scodone)
		{
			callback(errs);
		}
	}

	fs.readFile("../testdata/simple.orc",function(err,data)
	{
		if(err)
		{
			errs = err;
		}		

		orcdone = true;
		orctext = data;
		check();
	});

	fs.readFile("../testdata/simple.sco",function(err,data)
	{
		if(err)
		{
			errs = err;
		}		

		scodone = true;
		scotext = data;
		check();
	});
}

get_texts(function(err)
{
	if(err)
	{
		throw err;
	}

	sounder.write_files(orctext,scotext,function(err)
	{
		if(err)
		{
			throw err;
		}

		sounder.render_sound(process.stderr,function(err,path)
		{
			if(err)
			{
				throw err;
			}

			sounder.clean_files(function(err)
			{
				if(err)
				{
					throw err;
				}

				console.log("all done");
			});
		});
	});
});
