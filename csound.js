this.create_csound = function(callback)
{
	
	var fs = require("fs");
	var temp = require("temp");
	
	var cs = {};

	cs.write_files = function(orc,sco,callback)
	{
		var def={}

		cs.temp_orc = temp.open('orc',function(err,info)
		{
			if(err)
			{
				def.orc_ready = true;
				def.err = true;
				def.check();
				return;
			}

			cs.temp_orc = info;
			fs.writeFile(info.path,orc,function(err)
			{
				
				def.orc_ready = true;

				if(err)
				{
					def.err = true;
				}
				
				def.check();
			});
		});

		cs.temp_sco = temp.open('sco',function(err,info)
		{
			if(err)
			{
				def.sco_ready = true;
				def.err = true;
				def.check();
				return;
			}

			cs.temp_sco = info;
			fs.writeFile(info.path,sco,function(err)
			{
				def.sco_ready = true;

				if(err)
				{
					def.err = true;
				}
				
				def.check();
				
			});
		});

		def.check = function()
		{
			if(this.orc_ready && this.sco_ready)
			{
				callback(this.err);
			}
		}
	}

	cs.go = function(callback)
	{
		var cp = require('child_process');
		var outpath = temp.path("out");

		var cs_process = cp.spawn('csound',[cs.temp_orc.path,cs.temp_sco.path,'-o',outpath]);
		cs_process.stderr.pipe(process.stdout);
		
		cs_process.on("exit",function(code)
		{
			var err = false;
			if(code != 0)
			{
				err = true;
			}

			callback(err,outpath);
		});
		
	}
	return cs;
}

//leagcy
this.go = function(orcfile,scofile,outfile,output_stream,callback)
{
	var cp = require('child_process');
	var cs = cp.spawn('csound',[orcfile,scofile,'-o',outfile]);

	cs.stdout.on('data',function(chunk){console.log(chunk)});
	cs.stderr.pipe(output_stream);
	cs.on('exit',callback);
}
