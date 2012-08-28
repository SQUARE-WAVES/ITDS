exports.render_setup = function(jam)
{
	var output = "";

	for(k in jam.setup)
	{
		output += k + " = " + jam.setup[k] + "\n"; 
	}

	return output;
}

exports.render_globals = function(jam)
{
	var output = "";

	for(k in jam.globals)
	{
		output += k + " init " + jam.globals[k] + "\n"; 
	}

	return output;
}

exports.render_instrs = function(jam)
{
	var output = "";
	
	for(k in jam.instruments)
	{
		output += "instr " + jam.instruments[k].number+"\n";
		output += jam.instruments[k].code +"\n";
		output += "endin\n\n"
	}

	return output;
}

