this.create_csound = function(callback)
{
	var fs = require("fs");
	var temp = require("temp");
	
	var cs = {};

	//this writes the orc and sco data into temporary files
	cs.write_files = function(orc,sco,callback)
	{
		//a block to defer the callback till everything's done
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

	//this renders the temp orc and sco files into an outfile
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
			
			//store the output file in a manner consistent with the orc and sco
			temp_out = {"path":outpath};

			callback(err,outpath);
		});
		
	}

	//this deletes the orc sco and output files
	cs.cleanup = function(callback)
	{
		var def={}
		
		//delete the orc
		if(this.temp_orc)
		{
			fs.unlink(temp_orc.path,function(err)
			{
				if(err)
				{
					def.err = true;
				}
				def.orc = true;
				def.check();
			});
		}

		//delete the sco
		if(this.temp_sco)
		{
			fs.unlink(temp_sco.path,function(err)
			{
				if(err)
				{
					def.err = true;
				}
				def.sco = true;
				def.check();
			});
		}

		//delete the output
		if(this.temp_out)
		{
			fs.unlink(temp_sco.path,function(err)
			{
				if(err)
				{
					def.err = true;
				}
				def.out = true;
				def.check();
			});
		}

		def.check = function()
		{
			if(this.orc && this.sco && this.out)
			{
				callback(this.err);
			}
		}
	}

	return cs;
}
