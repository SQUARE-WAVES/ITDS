var NoteTable = Backbone.View.extend({
	
	'initialize':function()
	{
		_.bindAll(this, 'render');
		
		var seq = this.model.get('seq');
		
		seq.bind('change',this.render);
		seq.bind('add',this.render);
		seq.bind('remove',this.render);
		
		this.render();
	},
	
	'select_note' : function(ev)
	{
		var el = $(ev.currentTarget).closest('tr');
		var cid = el.attr('data-cid');
		var seq = this.model.get('seq');
		
		seq.map(function(note)
		{
			if(note.cid == cid)
			{
				note.set('selected',true);
			}
			else
			{
				note.set('selected',false);
			}
		});
		
	},
	
	'events' : 
	{
		'click tr.note_row' : 'select_note'
	},
	
	'render':function()
	{
		var template = this.options.template;
		var noteTemplate = this.options.noteTemplate;
		var params = this.model.get('instr').get('parameters');
		this.$el.empty();
		var renderable = {}
		
		renderable.parameters = params;
		
		var toAppend = $(template(renderable));
		var table = $(toAppend).children('#theTable');
		var seq = this.model.get('seq');
		
		var ticks = this.model.get('window').get('ticks_per_beat')
		
		var selected = seq.filter(function(note){return note.get('selected')});

		_(selected).each(function(note)
		{
			var noteRow = $('<tr></tr>');
			noteRow.attr('data-cid',note.cid);
			noteRow.addClass('note_row');
			if(note.get('selected'))
			{
				noteRow.addClass('info');
			}
		
			var ist = new Istatement
			({
				'model' : note,
				'el' : noteRow,
				'parameters': params,
				'ticksPer' : ticks,
				'template' : noteTemplate,
				'seq' : seq
			});
			
			table.append(noteRow);
		});
		
		this.$el.append(toAppend);
	}

});

var Istatement = Backbone.View.extend(
{
	'render':function()
	{
		var template = this.options.template;
		var params_list = this.options.parameters;
		var ticksPer = this.options.ticksPer;
		
		var renderable = function(note)
		{
			var ret={};
			ret.nn = note.get('nn');
			
			ret.parameters = _(params_list).map(function(item,key)
			{
				if(!note.get_param(key))
				{
					note.set_param(key,item,true);
				}	
					
				return {'name':key,'val':note.get_param(key)}
				
			});
			
			ret.cid = note.cid;
			
			return ret;
		}
		this.$el.empty();
		this.$el.append(template(renderable(this.model)));
	},
	
	'change_pval':function(ev)
	{
		var el = $(ev.currentTarget);
		var param = el.attr('data-param');
		var val = parseInt(el.val());
		
		this.model.set_param(param,val);
	},
	
	'delete':function(ev)
	{
		this.options.seq.remove(this.model);
	},
	
	'events':
	{
		'change input.param':'change_pval',
		'click td.delete_button':'delete'
	},
	
	'initialize':function()
	{
		_.bindAll(this, 'render','change_pval','delete','render');
		this.model.get('parameters').bind('change',this.render);
		this.render();
	}
	
});