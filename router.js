var assert_routeable = function(obj)
{
	if(!(typeof obj.route === 'function'))
	{
		throw "item is not routable";
	}
}

var assert_can_add_routes = function(obj)
{
	if(!(typeof obj.add_route === 'function'))
	{
		throw "item cannot add routes";
	}
}

var tokenize_path = function(path)
{
	var tokens = path.split('/');

	if('' === tokens[0])
	{ 
		tokens.splice(0,1);
	}

	if('' === tokens[tokens.length - 1])
	{
		tokens.pop();
	}
	
	//return it in a stack format so we can use pop
	return tokens.reverse();
}

var new_router = function()
{
	var route_table = {};
	var interface_table = {};

	var put_item = function(place,item)
	{
		route_table[place] = item;
	}

	var get_item = function(place)
	{
		return route_table[place];
	}

	interface_table.route = function(pathstack,args)
	{
		var step = pathstack.pop();
		var is_final = (pathstack.length === 0);
		var routeable = get_item(step);
		
		if(is_final)
		{
			routeable.route(args);
		}
		else
		{
			routeable.route(pathstack,args);
		}
	}

	interface_table.add_route = function(pathstack,routeable)
	{
		var step = pathstack.pop();
		var is_final = (pathstack.length === 0);
		
		if(is_final)
		{
			put_item(step,routeable);
		}
		else
		{
			var router = get_item(step);
			if(!router)
			{
				router = new_router();
				put_item(step,router);
			}
			
			router.add_route(pathstack,routeable);
		}
	}

	return interface_table;	
}

module.exports.create = function()
{
	var router = new_router();
	
	router.route_item = function(path,args)
	{
		var pathstack = tokenize_path(path);
		this.route(pathstack,args);
	}

	router.insert_resource = function(path,routeable)
	{
		assert_routeable(routeable);
		var pathstack = tokenize_path(path);
		this.add_route(pathstack,routeable);
	}

	return router;
}


