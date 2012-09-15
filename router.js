
module.exports.create_router = function(routes)
{
	var route_table = routes;
	var interface_table = {};

	var navigate_to_route = function(pathname)
	{
		var locale = route_table[pathname];
		return locale;
	}
	
	//stick a new thing at a route, it will clobber
	//anything that was allready there
	var add_route = function(pathname,method)
	{
		console.log("ADDING: "+pathname);
		route_table[pathname] = method;			
	}

	var add_routes = function(pathname,routes)
	{
		var newpath;
		for(k in routes)
		{
			newpath = pathname + k;
			add_route(newpath,routes[k]);
		}
	}

	var route=function(pathname,req,res)
	{
		var locale = navigate_to_route(pathname);
		
		//lets see how this goes
		
		if(typeof locale == 'function')
		{
			locale(req,res);
		}
		else
		{
			throw("route is not mapped");
		}
	}

	interface_table.route = route;
	interface_table.add_route = add_route;
	interface_table.add_routes = add_routes;

	return interface_table;
}
