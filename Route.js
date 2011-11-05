function Route() {
  this.resource = null;
  this.settings = {};
  this.parameters = [];
}

Route.prototype.match = function (path) {
  throw new Error('Route.prototype.match is abstract.');
};

module.exports = Route;
