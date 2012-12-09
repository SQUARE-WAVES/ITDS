var is_black_key = (function()
{
	var higlight_pitch_classes = 
	[
		false,
		true,
		false,
		true,
		false,
		false,
		true,
		false,
		true,
		false,
		true,
		false
	];
		
	return function(nn){return higlight_pitch_classes[nn%12];};
})();


var defaultPallate = {};
defaultPallate.background = "#FFFFFF";
defaultPallate.bar = "#000000";
defaultPallate.black_key = "#FF66CC";
defaultPallate.selected_note = "#00FF00";
defaultPallate.finished_note = "#FF0000";

var PianoRoll = Backbone.View.extend({

	"render_bars":function()
	{
		var ctx = this.options.bar_ctx;
		var width = this.options.width;
		var height = this.options.height;
		var pallate = this.options.pallate;
		var wnd = this.model.get('window');
		
		var clear = function()
		{
			ctx.clearRect(0,0,width,height);
		}
		
		var draw_bars = function(start_note,end_note)
		{
			//add one to get all the notes in there
			var num_notes = end_note - start_note + 1;
			var bar_height = height/num_notes;
			
			ctx.save();
			
			ctx.translate(0,-bar_height);
			ctx.strokeStyle = pallate.bar;
			
			for(var i=0;i<num_notes;++i)
			{
				if(is_black_key(start_note + i))
				{
					ctx.fillStyle = pallate.black_key;
				}
				else
				{
					ctx.fillStyle = pallate.background;
				}
				
				ctx.fillRect(0,height - (bar_height*i),width,bar_height);
				ctx.strokeRect(0,height - (bar_height*i),width,bar_height);
				
			}
			
			ctx.restore();
		}
		
		var draw_grid = function(start,end,ticks_per)
		{
			var ticks = end - start;
			var tick_width = width/ticks;
			var grid_width = tick_width * ticks_per;
			var grids = ticks/ticks_per;

			ctx.save();
			ctx.strokeStyle = pallate.bar;
			
			for(var i=0;i<grids;++i)
			{
				var x = grid_width * i;
				ctx.beginPath();
				ctx.moveTo(x,0);
				ctx.lineTo(x,height);
				ctx.stroke();
				
			}
			
			ctx.restore();
		}
		
		clear();
		draw_bars(wnd.get('bottom_nn'),wnd.get('top_nn'));
		draw_grid(wnd.get('start'),wnd.get('end'),wnd.get('ticks_per_grid'));
	},
	
	"render_notes":function()
	{
		var ctx = this.options.note_ctx;
		var width = this.options.width;
		var height = this.options.height;
		var pallate = this.options.pallate;
		var seq_window = this.model.get('window');
		
		var notes = seq_window.get_notes();
		
		var clear_notes = function()
		{
			ctx.clearRect(0,0,width,height);
		}
		
		var draw_note = function(note)
		{
			var ticks = seq_window.get('end') - seq_window.get('start');
			var tick_width = width/ticks;
			
			var get_note_rect = function(start,end,nn)
			{
				var start_x;
				var end_x;
				var start_y;
				var bar_height;
			
				if(start <= seq_window.get('start'))
				{
					start_x = 0;
				}
				else
				{
					start_x = tick_width * ( start - seq_window.get('start') );
				}
				
				if(end >= seq_window.get('end'))
				{
					end_x = width;
				}
				else
				{
					end_x = tick_width * ( end - seq_window.get('start') );
				}
				
				var rect_width = end_x - start_x;
				
				var num_notes = seq_window.get('top_nn') - seq_window.get('bottom_nn') + 1;
				var bar_height = height/num_notes;
				var bars_out = seq_window.get('top_nn') - nn;
				var top_y = bar_height*bars_out;

				var rect = {};
				rect.top = top_y;
				rect.left = start_x;
				rect.width = rect_width;
				rect.height = bar_height;
				
				return rect;
			}
			
			var rect = get_note_rect(note.get('start'),note.get('end'),note.get('nn'));
			
			ctx.save();
			
			if(note.get('selected'))
			{
				ctx.fillStyle = pallate.selected_note;
			}
			else
			{
				ctx.fillStyle = pallate.finished_note;
			}
			ctx.strokeStyle = pallate.bar;
			
			ctx.fillRect(rect.left,rect.top,rect.width,rect.height);
			ctx.strokeRect(rect.left,rect.top,rect.width,rect.height);
			ctx.restore();
		}
		
		
		clear_notes();
		
		_.each(notes,function(note)
		{
			draw_note(note);
		},
		this);
	},
	
	"render_all":function()
	{
		this.render_bars();
		this.render_notes();
	},
	
	'detect_hit':function(ev)
	{
		var seq = this.model.get('seq');
		var wnd = this.model.get('window');
	
		var x = ev.offsetX;
		var y = ev.offsetY;
	
		var width = this.options.width;
		var height = this.options.height;
		var ticks = wnd.get('end') - wnd.get('start');
		var ticks_per_grid = wnd.get('ticks_per_grid');
		var ticks_per_note = wnd.get('ticks_per_note');
		var end_note = wnd.get('top_nn');
		var start_note = wnd.get('bottom_nn');
		
		var tick_width = width/ticks;
		var tick = Math.floor(x/tick_width) + wnd.get('start');
		
		var grid_width = tick_width * ticks_per_grid;
		
		var grid_x = Math.floor(x/grid_width);
		
		var num_notes = end_note - start_note + 1;
		var bar_height = height/num_notes;
		
		var grid_y = num_notes - Math.ceil(y/bar_height);
		
		var start = grid_x * ticks_per_grid + wnd.get('start');
		var end = start + ticks_per_note;
		var nn = grid_y+start_note;
		
		var note = wnd.has_note(tick,nn);
		
		var select_note = function(cid,include)
		{
			if(!include)
			{
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
			}
			else
			{
				seq.getByCid(cid).set('selected',true);
			}
		}

		if(!note)
		{
			if(ev.ctrlKey)
			{
				var new_note = this.model.makeNote(start,end,nn);
				seq.add(new_note);
			}
			else
			{
				seq.map(function(note)
				{
					note.set('selected',false);
				});
			}
		}
		else
		{
			select_note(note.cid,ev.ctrlKey);
		}
	},
	
	'set_note':function(ev)
	{
		ev.preventDefault();
		var val = parseInt(ev.currentTarget.value);
		var seq_window = this.model.get('window');
		seq_window.set('ticks_per_note',val);
	},
	
	'set_grid':function(ev)
	{
		ev.preventDefault();
		var val = parseInt(ev.currentTarget.value);
		var seq_window = this.model.get('window');
		seq_window.set('ticks_per_grid',val);
	},
	
	'change_start':function(ev)
	{
		ev.preventDefault();
		var val = ev.currentTarget.value;
		var seqWindow = this.model.get('window');
		var ticksPer = seqWindow.get('ticks_per_beat')*seqWindow.get('beats_per_measure');
		var distance = seqWindow.get('end') - seqWindow.get('start');
		seqWindow.set('start',ticksPer * val,{silent:true});
		seqWindow.set('end',(ticksPer * val) + distance);
	},
	
	'change_range' : function(ev)
	{
		ev.preventDefault();
		var val = ev.currentTarget.value;
		var seqWindow = this.model.get('window');
		
		var ticksPer = seqWindow.get('ticks_per_beat')*seqWindow.get('beats_per_measure');
		var start = seqWindow.get('start');
		
		seqWindow.set('end',start+(val*ticksPer));
	},
	
	'change_note_start' : function(ev)
	{
		ev.preventDefault();
		var val = parseInt(ev.currentTarget.value);
		var seqWindow = this.model.get('window');
		
		var note_range = seqWindow.get('top_nn') - seqWindow.get('bottom_nn');
		
		seqWindow.set('bottom_nn',val);
		seqWindow.set('top_nn',val + note_range);
	},
	
	'change_octave' : function(ev)
	{
		ev.preventDefault();
		var val = parseInt(ev.currentTarget.value);
		var seqWindow = this.model.get('window');
		seqWindow.set('top_nn', seqWindow.get('bottom_nn') + (12*val));
	},
	
	'pianoRollKey' : function(ev)
	{
		ev.preventDefault();
		var wnd = this.model.get('window');
		var seq = this.model.get('seq');
		
		
		if(ev.keyCode == 46) //46 is the delete key
		{
			seq.remove(wnd.getSelected());
		}
	},
	
	'events':
	{
		'click .multicnv':'detect_hit',
		'change #gridSelector':'set_grid',
		'change #noteSelector':'set_note',
		'change #startMeausre' : 'change_start',
		'change #measures' : 'change_range',
		'change #botomnn' : 'change_note_start',
		'change #octaves' : 'change_octave'
	},
	
	'initialize':function()
	{
		_.bindAll(this, 'render_bars','render_notes','render_all','detect_hit','prep','set_note','pianoRollKey');
		
		this.model.get('window').bind('change',this.render_all);
		
		this.model.get('seq').bind('change',this.render_notes);
		this.model.get('seq').bind('add',this.render_notes);
		this.model.get('seq').bind('remove',this.render_notes);
		this.prep();
	},
	
		"prep":function()
	{
		var temp = this.options.template;
		var name = this.options.name;
		
		var template_context = 
		{
			"width" : this.options.width,
			"height" : this.options.height,
			"name" : name
		}

		this.$el.append(temp(template_context));
		
		var name = this.options.name;
		this.options.canvas1 = $("#"+name+" #layer1");
		this.options.canvas2 = $("#"+name+" #layer2");
		
		this.options.bar_ctx = this.options.canvas1[0].getContext('2d');
		this.options.note_ctx = this.options.canvas2[0].getContext('2d');
		this.render_all();
		
		this.$el.find('.multicnv').keydown(this.pianoRollKey);
		
	}
	
});

