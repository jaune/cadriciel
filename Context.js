var modules = {
  util : require('util'),
  url : require('url'),
  errors : require('./errors.js'),
  querystring : require('querystring'),
	view : require('./view')
};

var DefaultContentFilter =  require('./DefaultContentFilter.js');

function Context(web, request, response) {
		this.request = request;
		this.response = response;
		this.web = web;
		this.method = request.method;
		
		this.parameters = {};
		this.filter = null;
		this.action = null;
		this.resource = null;
		this.path = null;
		this.query = null;
};

Context.prototype.execute = function () {
		var url = modules.url.parse(this.request.url);
		this.path = url.pathname;
	
		this.resource = this.web.router.findResource(url.pathname);

		this.updateQuery(url.query);
		this.updateTypes();

		this.action = this.resource.findAction(this);
		this.updateFilter();

		(function (self ) {
			self.request.on('data', function (chunk) {
				try {
					self.filter.update(chunk);
				} catch (error) {
					self.error(error);
				}
			});
			self.request.on('end', function () {
				try {
					self.content = self.filter.final();
					self.action.execute(self);
				} catch (error) {
					self.error(error);
				}
			});
		})(this);
};


Context.buildErrorMessage = function (error) {
  var status = error.status || null;
  var message = error.message+'\r\n\r\n'+error.stack+'\r\n';
  if (status === null) {
    status = 500;
    message = '500 Internal Server Error\r\n\r\n'+message;
  }
  return message;
};

Context.prototype.message = function (name) {
  if (typeof name !== 'string') {
    throw new TypeError();
  }
  if (!(name in this.web.messages)) {
    throw new TypeError();
  }
  return this.web.messages[name];
};

Context.prototype.page = function (name) {
	return new modules.view.Page();
};

Context.prototype.form = function (name) {
  if (typeof name !== 'string') {
    throw new TypeError();
  }
  if (!(name in this.web.forms)) {
    throw new TypeError();
  }
  var Form = this.web.forms[name];
  return new Form();
};

Context.prototype.updateQuery = function (query) {
  if (query) {
    this.query = {
      'string' : query,
      'object' : modules.querystring.parse(query),
      'array' : [] //TODO array query filter
    };
  }
};

Context.prototype.updateFilter = function () {
  this.filter = new DefaultContentFilter();
    
  var type = this.type+'/'+this.subtype;
  var output = this.action.filter;
  if ((type in this.web.filters) && (output in this.web.filters[type])) {
    var filter = this.web.filters[type][output]
    this.filter = new filter();
  }
};

Context.prototype.updateTypes = function () {
  this.type = null;
  this.subtype = null;

  var headers = this.request.headers;
  if (!('content-type' in headers)) {
    return;
  }
  var MIMETYPE_PATERN = /^([-_a-z0-9]+)\u002f([-_a-z0-9]+)([ ]*;.*)?$/i;
  var result = MIMETYPE_PATERN.exec(headers['content-type']);
  if (!result) {
    return;
  }
  this.type = result[1];
  this.subtype = result[2];
};


Context.prototype.url = function (path) {
  return this.web.url(path);
};

Context.prototype.decrypt = function (data) {
  return this.web.decrypt(data);
};

Context.prototype.encrypt = function (data) {
  return this.web.encrypt(data);
};

Context.prototype.redirect = function (uri, status) {
  var status = status || 302;
  var rs = this.response;
  rs.writeHead(status, {
    'Content-Type': 'text/plain',
    'Location': uri
  });
  rs.end('Redirecting to ' + uri, 'utf-8');
};

Context.prototype.error = function (error) {
  var rs = this.response;
  var status = error.status || 500;
  var message = Context.buildErrorMessage(error);
  rs.writeHead(status);
  rs.end(message, 'utf-8');
  console.error(Context.buildErrorMessage(error));
};

Context.prototype.sendPage = function (page) {
	var writer = new modules.view.PageWriter(page, this.response);
	writer.writeHead(200, {});
	writer.writeContent();
}

Context.prototype.send = function (data) {
	if (data instanceof modules.view.Page) {
		this.sendPage(data);
	} else {
		throw new ErrorType();
	}
};

module.exports = Context;
