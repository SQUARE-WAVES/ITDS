var router = require("../router.js");

var testMethod = function(req,res)
{
	console.log("TESTMETHOD");
	console.log({"req":req,"res":res});
}

var testMethod2 = function(req,res)
{
	console.log("TEST TWO!");
	console.log([req,res]);
}

function test_routing()
{
	var r = router.create_router({"/shit/yeah":testMethod});
	console.log("should print '{req:dogs,:res:cats}'");
	r.route("/shit/yeah","dogs","cats");
}

function test_add_route()
{
	var r = router.create_router({"/shit/yeah":testMethod});
	r.add_route("/oh/snap",testMethod2);

	console.log("should see original");
	r.route("/shit/yeah","dogs","cats");

	console.log("should see new guy");
	r.route("/oh/snap","dogs","cats");
}

function test_add_routes()
{
	var newroutes = {};

	var list = ['/dogs/cats','/zip/zap','/fish/heads'];
	
	list.map(function(item)
	{
		newroutes[item] = function(req,res)
		{
			console.log("route at "+item);
			console.log([req,res]);
		}
	});

	var r = router.create_router({"/shit/yeah":testMethod});
	var new_route_start = '/oh/man';

	r.add_routes(new_route_start,newroutes);

	console.log("should see original");
	r.route("/shit/yeah","dogs","cats");
	
	list.map(function(item)
	{
		var newroute = new_route_start + item;
		console.log("trying: "+newroute);
		r.route(newroute,"way","cool");
	});
}

test_routing();
test_add_route();
test_add_routes();

