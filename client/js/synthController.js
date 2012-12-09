var SynthController = Backbone.View.extend(
{
	'render':function()
	{
		var template = this.options.template;
		
		var renderable = function(params)
		{
			var ret = {};
			var count = 0;
			var row = 0;
			
			//cut the params up into groups of 6 there is probably a better way
			ret.lines = [];
			ret.lines[row] = {'params':[]};
			_(params).map(function(val,key)
			{
				var item = {'name':key,'val':val};
			
				ret.lines[row].params.push(item);
				count++;
				if(count == 6)
				{
					row++;
					ret.lines[row] = {'params':[]};
					count = 0;
				}
			
			});
			
			return ret;
		}
		
		this.$el.empty();
		this.$el.append(template(renderable(this.model.get('params').toJSON())));
		
	},
	
	'setParam':function(ev)
	{
		var el = $(ev.currentTarget);
		var param = el.attr('data-param');
		var val = parseInt(el.val());
		
		var wnd = this.model.get('window');
		
		this.model.setDefault(param,val);
		
		_(wnd.getSelected()).each(function(item)
		{
			item.set_param(param,val);
		});
	},
	
	'events':
	{
		'change input.paramControl' : 'setParam'
	},
	
	'initialize':function()
	{
		_.bindAll(this,'render','setParam');
		this.render();
	}
});