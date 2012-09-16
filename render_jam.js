var templates = require("./templates.js");
var mustache = require("mustache");

var render_setup = function(setup)
{
	var renderables = Object.keys(setup).map(function(key)
	{
		return {"name":key,"val":setup[key]};
	});

	return mustache.render(templates.setup,{"setup":renderables});
}

var render_orc = function(jam)
{
	var orc_file = render_setup(jam.setup);
	orc_file += '\n\n';

	var make_renderable_instrument = function(instr,index)
	{
		//for some reason the key comes out as a string
		var actualnum =  parseInt(index) + 1;

		var renderable_instrument = {"number":actualnum};
		var renderable_params = [];
		var template = "instr {{number}}\n";
		var iter_index; //used for the loops

		//TODO::refactor to use object.keys
		for(iter_index in  instr.parameters)
		{
			var realval = parseInt(iter_index);
			//the  p numbers 1-3 are reserved in csound
			var param_lablel = 'p'+(realval+4);
			renderable_instrument[instr.parameters[iter_index]]=param_lablel;
		}
		
		template += instr.lines.join('\n');
		template += '\nendin\n\n';
		
		renderable_instrument.template=template;
		return renderable_instrument;	
	}
	
	function render_instrument(instr)
	{
		var template;
		return mustache.render(instr.template,instr)
	}

	var iter_index = 0;

	for(iter_index in jam.instruments)
	{
		
		var renderable = make_renderable_instrument(jam.instruments[iter_index],iter_index);
		orc_file += render_instrument(renderable);
	}

	return orc_file;	
}

var render_sco = function(track)
{
	return mustache.render(templates.score,track);
}

module.exports.render_orc = render_orc;
module.exports.render_setup = render_setup;
module.exports.render_sco = render_sco;
