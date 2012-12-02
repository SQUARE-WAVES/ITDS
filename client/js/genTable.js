var FTable =  Backbone.View.extend(
{
	'render_controls':function()
	{
		var controlBox = this.$el.find('#controlBox');
		controlBox.empty();
		controlBox.append('<button id="newgen">addGen</button>');
	},

	'render_table':function()
	{
		var mod = this.model;
		var genTemp = this.options.genTemplate;
		var place = this.$el.find('#fTable');

		place.empty();
		var rows = $(this.options.template({}));
		var tab = rows.find('#theTable');
		place.append(rows);
		var list = this.model;
		this.model.each(function(gen,index)
		{
			var row = $('<tr></tr>');
			var view = new FStatement(
			{
				'el':row,
				'template':genTemp,
				'index':index,
				'list' : list,
				'model' : gen
			});
			tab.append(row);
		});
	},
	
	'render':function()
	{
		this.render_controls();
		this.render_table();
	},
	
	'add_gen': function(ev)
	{
		this.model.add({
		});
	},
	
	'events':
	{
		'click #newgen' : 'add_gen'
	},
	
	'initialize':function()
	{
		_.bindAll(this,'add_gen','render');
		
		this.model.bind('add',this.render);
		this.model.bind('remove',this.render);
		this.model.bind('change',this.render);
		
		this.render();
	}
});

var FStatement = Backbone.View.extend(
{
	'render' : function()
	{
		var ret = this.model.toJSON();
		ret.number = this.options.index;
		
		this.$el.append(this.options.template(ret));
	},
	
	'changeSize' : function(ev)
	{
		this.model.set('size',ev.currentTarget.value);
	},
	
	'changeGen' : function(ev)
	{
		this.model.set('gen',ev.currentTarget.value);
	},
	
	'changeParams' : function(ev) 
	{
		this.model.set('params',ev.currentTarget.value);
	},
	
	'delete' : function(ev)
	{
		this.options.list.remove(this.model);
	},
	
	'events' :
	{
		'click .delete_button' : 'delete',
		'change #params' : 'changeParams',
		'change #tabSize' : 'changeSize',
		'change #genNumber' : 'changeGen',
	},
	
	'initialize' : function()
	{
		_.bindAll(this,'changeSize', 'delete', 'changeParams', 'changeGen', 'render');
		this.render();
	}
});