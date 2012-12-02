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
})(Handlebars);