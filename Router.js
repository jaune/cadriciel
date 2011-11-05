var modules = {
  errors : require('./errors.js')
};

var Route = require('./Route.js');
var Resource = require('./Resource.js');

function Router () {
  this.routes = [];
}

Router.prototype.push = function (route) {
  if (!route instanceof Route) {
    throw new Error('route parameter should be a Route.');
  }
  this.routes.push(route);
};

Router.prototype.findResource = function (path) {
  var route = null;
  var routes = this.routes;
  for (var i = 0, l = routes.length; i < l; i++) {
    if (routes[i].match(path)) {
      if (route !== null) {
        throw new modules.errors.Error400('Ambiguous path.');
      }
      route = routes[i];
    }
  }
  if (route === null) {
    throw new modules.errors.Error404('Route not found with path `'+path+'`.');
  }
  var resource = route.resource || null;
  if (!resource) {
    throw new modules.errors.Error404('Resource missing.');
  }
  if (!resource instanceof Resource) {
    throw new modules.errors.Error404('The resource should be a Resource.');
  }
  return resource;
}

module.exports = Router;
