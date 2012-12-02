var trackJson = function (track,jam)
{
	var ret={};
	ret.name = track.get('name');
	
	var notes = track.get('seq');
	var instr = track.get('instr');
	var inum =  jam.get('instruments').indexOf(instr);
	
	ret.istatements = notes.map(function(note)
	{
		var istat = {};
		istat.inum = inum+1;
		istat.start = note.get('start');
		istat.end = note.get('end');
		istat.parameters = instr.get('parameters').map(function(param)
		{
			return note.get('parameters')[param];
		});
		
		istat.nn = note.get('nn');
		return istat;
	});

	return ret;
}

var ftabJson = function(ftab)
{
	ret = {};
	ret.gen = ftab.get('gen');
	ret.size = ftab.get('size');
	ret.load = ftab.get('load');
	ret.params = ftab.get('params');
	
	return ret;
}

var jamJson = function(jam,tempo)
{
	var ret = {};
	
	ret.name = jam.get('name');
	ret.instruments=jam.get('instruments').map(function(instr)
	{
		return instr.toJSON();
	});
	
	ret.setup = {}
	ret.setup.sr = jam.get('sr');
	ret.setup.kr = jam.get('kr');
  ret.setup.ksmps = jam.get('ksmps');
  ret.setup.nchnls = jam.get('nchnls');
	
	ret.tracks = jam.get('tracks').map(function(track)
	{
		return trackJson(track,jam);
	});
	
	ret.ftabs = jam.get('waves').map(ftabJson);
	
	return ret;
}


