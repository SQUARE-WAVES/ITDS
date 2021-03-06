var Note = Backbone.Model.extend(
{
	'defaults':
	{
		'start':0,
		'end':24,
		'nn':63,
		'selected':false
	},
	
	'set_param' : function(name,val,silent)
	{
		this.get('parameters').set(name,val,{'silent':silent});
	},
	
	'get_param' : function(name)
	{
		return this.attributes.parameters.get(name);
	},
	
	'initialize':function()
	{
		_.bindAll(this,'get_param','set_param');
		
		if(!this.attributes.parameters)
		{
			this.attributes.parameters = new Backbone.Model({});
		}
		
	}
});

var Sequence = Backbone.Collection.extend(
{
	'model':Note
});

var Window = Backbone.Model.extend(
{
	'defaults' :
	{
		'bottom_nn' : 60,
		'top_nn' : 84,
		'start' : 0, //these are measured in ticks
		'end' : 96, //once again in ticks
		'beats_per_measure' : 4,
		'ticks_per_beat' : 24, //a tick is a 96th note like midi clock
		'ticks_per_grid' : 24,
		'ticks_per_note' : 24
	},
	
	'initialize': function()
	{
		_.bindAll(this,'get_notes','contains');
		
		if(this.attributes.sequence)
		{
			this.attributes.sequence.bind('add',this.change);
			this.attributes.sequence.bind('remove',this.change);
		}
	},
	
	'has_note' : function(tick,nn)
	{
		var notes=this.get_notes();
		var theNote = false;
		
		//-------------------------------------------------------------------------
		//todo::use a try catch to early exit?
		//-------------------------------------------------------------------------
		_.each(notes,function(note)
		{
			if(note.get('start') <= tick
			&& note.get('end') >= tick
			&& note.get('nn') == nn)
			{
				theNote = note;
			}
		});
		
		return theNote;
	},
	
	'contains' : function(note)
	{
		var contains_start = (note.get('start') >= this.attributes.start && note.get('start') < this.attributes.end);
		var contains_end = (note.get('end') > this.attributes.start && note.get('end') < this.attributes.end);
		var contains_note = (note.get('nn') >= this.attributes.bottom_nn && note.get('nn') <= this.attributes.top_nn);
			
		return contains_note && (contains_start || contains_end);
	},
	
	'get_notes' : function()
	{
		var seq = this.attributes.seq;
		var notes = [];
		
		if(seq)
		{
			seq.each(function(note)
			{
				if(this.contains(note))
				{
					notes.push(note);
				}
			},this);
		}
		
		return notes;
	},
	
	'getSelected':function()
	{
		var seq = this.attributes.seq;
		return seq.filter(function(note)
		{
			return note.get('selected');
		});
	}
});

//right now it just holds a list of parameters and also the code
var Instrument = Backbone.Model.extend(
{
	'defaults':
	{
		'name':'new instrument'
	},
	
});

var Track = Backbone.Model.extend(
{
	'defaults':
	{
	},
	
	'makeNote':function(start,end,nn)
	{
		var new_note = new Note(
		{
			'start':start,
			'end':end,
			'nn':nn,
		});
		
		_(this.attributes.params.toJSON()).map(function(val,key)
		{
			new_note.set_param(key,val,true);
		});

		return new_note;
	},
	
	'setDefault':function(param,val,silent)
	{
		this.attributes.params.set(param,val,{'silent':true});
		
		if(!silent)
		{
			this.change();
		}
		
	},
	
	'initialize':function()
	{
		if(!this.attributes.seq)
		{
			this.attributes.seq = new Sequence();
		}
		
		this.attributes.window = new Window(
		{
			'seq':this.attributes.seq
		});
		
		this.attributes.params = new Backbone.Model(this.attributes.instr.get('parameters'));
		
	}
});

var Waveform = Backbone.Model.extend(
{
	'defaults':
	{
		'gen' : 10,
		'size' : 512,
		'load' : 0,
		'params' : ''
	},	
});

var Tracklist = Backbone.Collection.extend(
{
	'model':Track
});

var InstrumentList = Backbone.Collection.extend(
{
	'model':Instrument
});

var WaveList = Backbone.Collection.extend(
{
	'model':Waveform
});

var Jam = Backbone.Model.extend(
{
	'defaults':
	{
		'sr': 48000,
		'kr': 4800,
		'ksmps': 10,
		'nchnls': 2,
	},
	
	'addTrack':function(name,instr)
	{
		var tracks = this.get('tracks');
		tracks.add(
		{
			'name' : name,
			'instr' : instr
		});
	},
	
	'addInstrument':function(instr)
	{
		var instruments = this.get('instruments');
		instruments.add(instr);
	},
	
	'initialize' : function()
	{
		if(!this.attributes.tracks)
		{
			this.attributes.tracks = new Tracklist();
		}
		
		if(!this.attributes.instruments)
		{
			this.attributes.instruments = new InstrumentList();
		}
		
		if(!this.attributes.waves)
		{
			this.attributes.waves = new WaveList();
		}
	},
	
	'hasTrack':function(name)
	{
		var tracks = this.get('tracks');
		var tracksWithName = tracks.filter(function(track)
		{
			return track.get('name') == name;
		});
		
		return tracksWithName.length != 0;
	}
	
});
