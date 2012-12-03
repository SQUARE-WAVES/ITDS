var JamView =  Backbone.View.extend(
{
	'render':function()
	{
		this.render_controls();
		this.render_tracks();
		this.render_waves();
	},
	
	'render_controls' : function()
	{
		var controlsTemplate = this.options.controlsTemplate;
		var instruments = this.model.get('instruments');
		
		var renderable = function()
		{
			ret = {};
			
			ret.instruments = instruments.map(function(instr) 
			{
				return {'name':instr.get('name'),'cid':instr.cid};
			});
			
			return ret;
		}
		
		var $el = this.$el;
		var sidebar = $el.find('#controlBox');
		
		sidebar.empty();
		sidebar.append(controlsTemplate(renderable(this)));
		
	},
	
	'render_tracks' : function()
	{
		var $el = this.$el;

		var trackTemplate = this.options.trackTemplate;
		var tabTemplate = this.options.tabTemplate;
		var notePartial = this.options.notePartial;
		var prollTemplate = this.options.prollTemplate;
		
		var navbar = $el.find("#tabber");
		var tabContent = $el.find("#tabCont");
		var li = '<li></li>';
		var anchor = '<a data-toggle="tab"></a>';
		
		navbar.empty();
		tabContent.empty();
		
		this.trackViews = this.model.get('tracks').map(function(track)
		{
			var trackname = track.get('name');
			var navAnchor = $(anchor).attr('href','#'+trackname).text(trackname);
			var navLi = $(li).append(navAnchor);
			navbar.append(navLi);
		
			var tview = new TrackTab(
			{
				'el' : tabContent,
				'model' : track,
				'prollTemplate' : prollTemplate,
				'notePartial' : notePartial,
				'tabTemplate' : tabTemplate,
				'template' : trackTemplate
			});
			
			return tview;
		});

		navbar.find('a').tab();	
	},
	
	'render_waves':function()
	{
		var wavezone = this.$el.find('#waveCont');
		
		var genTableTemplate = this.options.genTableTemplate;
		var genRowTemplate= this.options.genRowTemplate;
		
		var ftab = new FTable(
		{
			'el' : wavezone,
			'model' : this.model.get('waves'),
			'template' : genTableTemplate,
			'genTemplate' : genRowTemplate
		});
	},
	
	'addTrack':function(ev)
	{
		var cid = $('#instr-select').val();
		var name = $('#track-name').val();
		
		if(name == "")
		{
			alert('tracks gotta have a name');
			return;
		}
		
		var instr = this.model.get('instruments').getByCid(cid);
		this.model.addTrack(name,instr);
	},
	
	'events':
	{
		'click #add-track' : 'addTrack'
	},
	
	'initialize' : function()
	{
		_.bindAll(this, 'render_tracks','render_controls','render','addTrack');
			
		this.model.get('tracks').bind('add',this.render_tracks);
		this.model.get('tracks').bind('remove',this.render_tracks);
		
		this.render();
	}
});

var TrackTab = Backbone.View.extend({
	
	'render':function()
	{
		var $el = this.$el;
		var template = this.options.template;
		var tabTemplate = this.options.tabTemplate;
		var notePartial = this.options.notePartial;
		var prollTemplate = this.options.prollTemplate;
		
		var renderable = function(theTrack)
		{
			return {'name':theTrack.get('name')};
		}
		
		var domAddition = template(renderable(this.model));
		
		var seq = this.model.get('seq');
		var wnd = this.model.get('window');
		var name= this.model.get('name');
		
		var $el = $el.append(domAddition)
		var prollDiv = $el.find('#'+name+' div.proller');
		var tabDiv = $el.find('#'+name+' div.tablespot');

		this.proll = new PianoRoll(
		{
			'el' : prollDiv,
			'model' : wnd,
			'width' : 1000,
			'height' : 500,
			'pallate' : defaultPallate,
			'template' : prollTemplate,
			'name' : name+'-proll'
		});
		
		this.noteTab = new NoteTable(
		{
			'el':tabDiv,
			'model':this.model,
			'template':tabTemplate,
			'noteTemplate':notePartial
		});
	},
	
	'initialize' : function()
	{
		this.render();
	}
	
});