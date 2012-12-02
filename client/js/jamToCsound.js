var jamToCsound = function(jsonrep,tempo)
{
	//leaviong this so I don't have to do algebra again
	var seconds_per_beat = 1/(tempo/60);
	var seconds_per_tick = (seconds_per_beat/24);
	
	var sco = '';

	var ftabs = jsonrep.ftabs.map(function(tab,index)
	{
		return 'f '+(index+1)+' '+tab.load+' '+tab.size+' '+tab.gen+' '+tab.params;
	});

	var tracks = jsonrep.tracks.map(function(track)
	{
		var ret=[]
		ret.push(';track: '+track.name);
		var statements = track.istatements.map(function(istat)
		{
			var params = istat.parameters.join(' ');
			var num = istat.inum;
			var start = istat.start*seconds_per_tick;
			var dur = (istat.end*seconds_per_tick) - start;
			
			return 'i'+num+' '+start+' '+dur+' '+ istat.nn +' '+params;
			
		});
		
		ret = ret.concat(statements);
		
		return ret.join('\n')+'\n';
	});
	
	if(ftabs.length > 0)
	{
		console.log(ftabs);
		sco = sco + ftabs.join('\n');
	}
	
	if(tracks.length > 0)
	{
		console.log(tracks);
		sco = sco + '\n\n' + tracks.join('\n')
	}
	
	$("#scoInput").val(sco);
	
	var orc = '';
	
	var setup =_.reduce(jsonrep.setup,function(memo,val,key,setup)
	{
		return memo+ key + '=' + val +'\n'
	},'');

	if(setup)
	{
		orc = orc+setup +'\n\n';
	}
	
	var instruments = jsonrep.instruments.map(function(instr,index)
	{
		var instrTxt =';Instrument: ' + instr.name + '\n';
		instrTxt += 'instr '+(index+1) +'\n';
		instrTxt += (instr.lines.join('\n'));
		instrTxt += '\nendin\n';
		
		return instrTxt;
	});
	
	if(instruments)
	{
		orc = orc+instruments.join('\n');
	}
	
	$("#orcInput").val(orc);
}