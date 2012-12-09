(function(bars)
{
	bars.registerHelper('ifMatches',function(data,val,options)
	{
		if(data == val)
		{
			return options.fn(this);
		}
		else
		{
			return options.inverse(this);
		}
	});
	
	bars.registerHelper('keys', function(context, options) 
	{
    var ret="";
		
    for(var key in context)
    {
			if(context.hasOwnProperty(key))
			{
        ret = ret + options.fn({'key':key,'val':context[key]});
			}
    }
		
    return ret;
});
})(Handlebars);