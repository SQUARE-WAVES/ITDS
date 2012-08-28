var cs = require("../csound.js");
var assert = require("assert");
var fs = require("fs");

var test = {}



test["test write files"] = function(done)
{
	var test_orc = "whatever";
	var test_sco = "who cares";

	test_sound = cs.create_csound();

	csound.write_filesa(test_orc,test_sco,function(err)
	{
		try
		{
		assert.notOk(err);
		assert.ok(test_orc.fd,"the orc should have a file descriptor");
		assert.ok(test_sco.fd),"the sco should have a file descriptor");
		assert.ok(test_orc.path,"the orc should have a path");
		assert.ok(test_sco.path,"the sco should have a path");

		var orcval = fs.readFileSync(test_orc.path,'ascii');
		var scoval = fs.readFileSync(test_sco.path,'ascii');
		assert.equal(test_orc,orcval,"the orc file should have the right values written");
		assert.equal(test_sco,scoval,"the sco file should hvae the right values written");

		done(true);
		}
		catch(err);
		{
			done(false,err);
		}
	});	
}

//for now just do like this
function test_complete(passed,err)
{
	if(passed)
	{
		console.log("test passed");
	}
	if(err)
	{
		console.log("test failed: " + err)
	}
}

for(k in test)
{
	console.log("running: " key);
	test[key](test_complete);
}
