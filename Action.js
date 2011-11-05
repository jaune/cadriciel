QueryActionParameter =  require('./QueryActionParameter.js');
TypeActionParameter =  require('./TypeActionParameter.js');

function Action(method, action, parameters) {
  this.method = method;
  this.action = action;
  this.parameters = parameters;
}

Action.parse = function (json) {
  if (!('method' in json) || !('action' in json)) {
    throw new TypeError();
  }
  if (typeof json.action != 'function') {
    throw new TypeError();
  }
  var parameters = {};
  parameters.query = QueryActionParameter.parse(json);
  parameters.type = TypeActionParameter.parse(json);
 
  var self = new Action(
    json.method,
    json.action,
    parameters);
  self.filter = json.filter || null;
  return self;
};
 
Action.prototype.match = function(context) {
  if (context.method !== this.method) {
    return false;
  }

  if (this.parameters.type) {
    return this.parameters.type.match(context);
  }
  
  if (!this.parameters.query && context.query) {
    return false;
  }
  if (this.parameters.query) {
    if (!context.query) {
      return false;
    }
    return this.parameters.query.match(context.query[this.parameters.query.filter]);
  }
  return true;
};

Action.prototype.execute = function(context) {
  var parameters = {};
  
  if (this.parameters.query) {
    parameters.query = context.query[this.parameters.query.filter];
  }
  return this.action.call(context, parameters, context.content);
};


module.exports = Action;
