var http = require("http");
var fs = require("fs");

var COUCH_PORT = 5984;
var COUCH_DBPATH = '/csound/';
var COUCH_UNAME = "the-h";
var COUCH_PASS = "MOS6581";
var COUCH_HOST = "localhost";

//helper for making requests to the couchdb
var make_couch_request = function(method,path,query,headers)
{
	var qs = require("querystring");
	var opts = {}
	opts.host = COUCH_HOST;
	opts.port = COUCH_PORT;
	opts.method = method;
	opts.auth = COUCH_UNAME + ":" + COUCH_PASS;
	opts.path = path + '?' + qs.stringify(query);
	opts.headers = headers;

	return opts
}

//helper to get the jam doc
var get_jam = function(jam_name,callback)
{
	var COUCH_LIST = "_design/jams/_list/complete_jam/by_name";
	var startkey = '["'+jam_name+'",0]';
	var endkey = '["'+jam_name+'",100000]';

	var query = 
	{
		"include_docs":"true",
		"startkey":startkey,
		"endkey":	endkey
	};
	
	var path = COUCH_DBPATH+COUCH_LIST;
	var reqopts = make_couch_request('GET',path,query);

	var req = http.request(reqopts,function(res)
	{
		var body="";
		
		res.on("data",function(chunk)
		{
			body+=chunk;
		});

		res.on("end",function()
		{
			callback(JSON.parse(body)[jam_name]);
		});

	});	

	req.end();
	return req;
}

var attach_sound = function(jamid,jamrev,filepath,attachment_name,callback)
{
	fs.stat(filepath,function(err,stats)
	{
		if(err)
		{
			throw err;
		}

		var path = COUCH_DBPATH+jamid+'/'+attachment_name;
		var headers = 
		{
			"Content-Type":"audio/wav",
			"Content-Length":stats.size
		};

		var reqopts = make_couch_request('PUT',path,{"rev":jamrev},headers);

		var file_stream = fs.createReadStream(filepath);

		var req = http.request(reqopts,callback);
		
		file_stream.pipe(req);
		req.end();
		return req;
	});

}

module.exports.get_jam = get_jam;
module.exports.attach_sound = attach_sound;
