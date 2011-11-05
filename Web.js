var modules = {
  http : require('http'),
  crypto : require('crypto')
};

var Route = require('./Route.js');
var Router = require('./Router.js');
var Resource = require('./Resource.js');
var Context = require('./Context.js');

var MessageClass = require('./MessageClass.js');


function Web (configuration) {
  if (!configuration) {
    throw new TypeError();
  }
  if (typeof configuration != 'object') {
    throw new TypeError();
  }
  if (!('host' in configuration)) {
    throw new TypeError();
  }
  if (!('security' in configuration)) {
    throw new TypeError();
  }
  if (!('algorithm' in configuration.security)) {
    throw new TypeError();
  }
  if (!('password' in configuration.security)) {
    throw new TypeError();
  }

  this.configuration = configuration;
  this.router = new Router();

	this.resources = {};
  this.messages = {};
  this.forms = {};
	this.pages = {};
  this.filters = {};
}

Web.prototype.message = function (name, fields) {
  var message_class = new MessageClass(name);
  var keys = Object.keys(fields);
  for (var i = 0, l = keys.length; i < l; i++) {
    message_class.setField(keys[i], fields[keys[i]]);
  }
  this.messages[name] = message_class;
  return message_class;
};

Web.prototype.url = function (path, secure) {
  var path = path || '/';
  return (secure===true?'https://':'http://') + this.configuration.host + path;
};

Web.prototype.resource = function (name, actions) {
	if (!actions) {
		if (name in this.resources) {
			return this.resources[name];
		}
		return null;
	}
  var resource =  new Resource();
  for (var i = 0, l = actions.length; i < l; i++) {
    resource.action(actions[i]);
  }
  this.resources[name] = resource;
};

Web.prototype.form = function (name, form) {
  if (typeof name !== 'string') {
    throw new TypeError();
  }
  this.forms[name] = form;
};

Web.prototype.page = function (name, page) {
  if (typeof name !== 'string') {
    throw new TypeError();
  }
  this.pages[name] = page;
};

Web.prototype.filter = function (in_type, out_type, filter) {
  if (typeof in_type !== 'string' || typeof out_type !== 'string') {
    throw new TypeError();
  }
  if (!(in_type in this.filters)) {
    this.filters[in_type] = {}
  }
  this.filters[in_type][out_type] = filter;
};

Web.prototype.route = function (match, resource) {
  if (typeof match !== 'function') {
    throw new TypeError('Match parameter should be a function.');
  }
  if (!(resource in this.resources)) {
    throw new TypeError('Resource parameter should be a Resource.');
  }
  var route = new Route();
  route.match = match;
  route.resource = this.resources[resource];
  this.router.push(route);
};

Web.prototype.start = function () {
  var server  = new modules.http.Server();
  (function (self, server) {
    server.on('request', function (rq, rs) {
      try {
        var context = new Context(self, rq, rs);
				try {
					context.execute();
				} catch (error) {
					context.error(error);
				}
      } catch (error) {
        console.log(error);
				rs.end();
      }
    });
   })(this, server);
  server.listen(8001, '127.0.0.1');
};


Web.prototype.encrypt = function (data) {
  var cipher = modules.crypto.createCipher(this.configuration.security.algorithm,  this.configuration.security.password);
  var result = cipher.update(data, 'ascii', 'hex');
  return result + cipher.final('hex');
};

Web.prototype.decrypt = function (data) {
  var decipher = modules.crypto.createDecipher(this.configuration.security.algorithm,  this.configuration.security.password);
  var result = decipher.update(data, 'hex', 'ascii');
  return result + decipher.final('hex')
};


module.exports = Web;

