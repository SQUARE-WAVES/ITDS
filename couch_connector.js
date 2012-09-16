var http = require("http");
var fs = require("fs");

var COUCH_PORT = 5984;
var COUCH_DBPATH = '/csound/';
var COUCH_UNAME = "the-h";
var COUCH_PASS = "MOS6581";
var COUCH_HOST = "localhost";

//helper for making requests to the couchdb
var make_couch_request = function(method,path,query)
{
	var opts = {}
	opts.host = COUCH_HOST;
	opts.port = COUCH_PORT;
	opts.method = method;
	opts.auth = COUCH_UNAME + ":" + COUCH_PASS;
	opts.path = path;

	return opts
}

//helper to get the jam doc
var get_jam = function(jam_name,callback)
{
	var COUCH_LIST = "_design/jams/_list/complete_jam/by_name?";
	var qs = require("querystring");
	var startkey = '["'+jam_name+'",0]';
	var endkey = '["'+jam_name+'",100000]';

	var query = qs.stringify(
	{
		"include_docs":"true",
		"startkey":startkey,
		"endkey":	endkey
	});
	
	var path = COUCH_DBPATH+COUCH_LIST+query;
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

//TODO::get these running later
var attach_file = function(jamid,filepath,attachment_name,contentmime)
{
	
}

module.exports.get_jam = get_jam;
