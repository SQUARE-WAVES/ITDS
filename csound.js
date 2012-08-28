var fs = require("fs");
var temp = require("temp");

function csound()
{
	this.orcfile = temp.path("orc");
	this.scofile = temp.path("sco");
	this.outfile = temp.path("out");
}

//-----------------------------------------------------------------------------
//callback takes an err string
//-----------------------------------------------------------------------------
csound.prototype.write_orc = function(orctext,callback)
{
	var cs = this;
	fs.writeFile(cs.orcfile,orctext,function(err)
	{
		callback(err);
	});
}

//-----------------------------------------------------------------------------
//callback takes an err string
//-----------------------------------------------------------------------------
csound.prototype.write_sco = function(scotext,callback)
{
	var cs = this;

	fs.writeFile(cs.scofile,scotext,function(err)
	{
		callback(err);
	});
}

//-----------------------------------------------------------------------------
//callback takes an err string
//-----------------------------------------------------------------------------
csound.prototype.write_files = function(orctext,scotext,callback)
{
	var orcdone = false;
	var scodone = false;
	var	errors = "";
	
	function check()
	{
		if(orcdone && scodone)
		{
			callback(errors);
		}
	}

	this.write_orc(orctext,function(err)
	{
		if(err)
		{
			errors += "orc failed: "+ err +" ";
		}

		orcdone = true;
		check();
	});

	this.write_sco(scotext,function(err)
	{
		if(err)
		{
			errors += "sco failed: "+ err +" ";
		}

		scodone = true;
		check();
	});
}

//-----------------------------------------------------------------------------
//callback takes an err string and a filepath to the sound file
//-----------------------------------------------------------------------------
csound.prototype.render_sound = function(infostream,callback)
{
	var cs = this;
	var cp = require('child_process');

	var cs_process = cp.spawn('csound',[cs.orcfile,cs.scofile,'-o',cs.outfile]);

	if(infostream)
	{
		//pipe the info to this bad boy
		cs_process.stderr.pipe(infostream);
	}

	cs_process.on("exit",function(code)
	{
		var err = false;
		if(code != 0)
		{
			err = true;
		}
		
		callback(err,this.outfile);
	});
}

//TODO:: FIGURE OUT HOW TO GET GARBAGE COLLECTION TO HANDLE THIS SHIT
//-----------------------------------------------------------------------------
//callback takes an error string
//-----------------------------------------------------------------------------
csound.prototype.clean_orc = function(callback)
{
	fs.unlink(this.orcfile,callback);
}

//-----------------------------------------------------------------------------
//callback takes an error string
//-----------------------------------------------------------------------------
csound.prototype.clean_sco = function(callback)
{
	fs.unlink(this.scofile,callback);
}

//-----------------------------------------------------------------------------
//callback takes an error string
//-----------------------------------------------------------------------------
csound.prototype.clean_out = function(callback)
{
	fs.unlink(this.outfile,callback);
}

//-----------------------------------------------------------------------------
//callback takes an error string
//-----------------------------------------------------------------------------
csound.prototype.clean_files = function(callback)
{
	var orcdone = false;
	var scodone = false;
	var outdone = false;
	var	errors = "";
	
	function check()
	{
		if(orcdone && scodone && outdone)
		{
			callback(errors);
		}
	}

	this.clean_orc(function(err)
	{
		if(err)
		{
			errors += "orc error";
		}

		orcdonce = true;
		check();

	});

	this.clean_sco(function(err)
	{
		if(err)
		{
			errors += "sco error";
		}

		scodone = true;
		check();

	});

	this.clean_out(function(err)
	{
		if(err)
		{
			errors += "out error";
		}

		outdone = true;
		check();
	});
}


exports.new_csound = function()
{
	return new csound();
}



//-----------------------------------------------------------------------------
//LEGACY
//-----------------------------------------------------------------------------
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
		cs_process.stderr.pipe(process.stdut);
		
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
