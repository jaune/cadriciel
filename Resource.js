var modules = {
  errors : require('./errors.js')
};

var Action = require('./Action.js');

function Resource() {
  this.actions = {};
}

Resource.prototype.findAction = function (request) {
  if (!(request.method in this.actions)) {
    throw new modules.errors.Error405();
  }
  var actions = this.actions[request.method];
  var action = null;
  for (var i = 0, l = actions.length; i < l; i++) {
    if (actions[i].match(request)) {
      if (action !== null) {
        throw new modules.errors.Error400('Ambiguous request.');
      }
      action = actions[i];
    }
  }
  if (action === null) {
      throw new modules.errors.Error405();
  }
  return action;
}

Resource.prototype.action = function (json) {
  var action = Action.parse(json);
  var method = action.method.toUpperCase();
  if (!(method in this.actions)) {
    this.actions[method] = [];
  }
  this.actions[method].push(action);
};

module.exports = Resource;

