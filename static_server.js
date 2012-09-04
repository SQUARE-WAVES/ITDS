var fs = require("fs");

function static_server(urlpath, filepath) 
{
	this.fspath = filepath;
	this.urlpath = urlpath;
}

function get_absolute_path(urlpath,fspath,resourcepath) 
{
	return fspath + resourcepath.substring(urlpath.length, resourcepath.length);
}

static_server.prototype.serve = function(path,res)
{
	var filepath  = get_absolute_path(this.urlpath,this.fspath,path);
	var stream = fs.createReadStream(filepath);
	stream.pipe(res);
}

module.exports.create_static_server = function(urlpath,filepath)
{
	function validate_path(path,error_header) 
	{
		if (path[path.length - 1] !== '/') 
		{
			throw {"err":error_header, "msg":"path must end with '/'"};
		}
	}
	
	validate_path(urlpath,"url path");
	validate_path(filepath,"filesystem path");

	return new static_server(urlpath,filepath);
}

