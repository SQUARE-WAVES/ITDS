var router = require("../router.js");

var test_routeable1 = {}
test_routeable1.route = function(args)
{
	console.log("you sent me:");
	console.log(args);
}

var test_routeable2 = {};
test_routeable2.route = function(pathstack,args)
{
	console.log("you "+pathstack.pop()+" me:");
	console.log(args);
}

var test_non_routeable = {};

var router1 = router.create();

router1.insert_resource("/dogs/of/spain",test_routeable1);
router1.insert_resource("/cats/of/",test_routeable2);

try
{
	router1.insert_resource("/WHAT/THE",test_non_routeable);
}
catch(exception)
{
	console.log("should get an exception:");
	console.log(exception);
}


router1.route_item("/dogs/of/spain","catfish");
router1.route_item("/cats/of/shit",{"hey":"boy"});
router1.route_item("/cats/of/love",{"hey":"boy"});
