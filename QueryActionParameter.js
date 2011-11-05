function QueryActionParameter(filter, match){
  this.filter = filter;
  this.match = match;
};

QueryActionParameter.parse = function (json) {
  var filter = 'object';
  var match = null;

  if ('query' in json) {
    switch (typeof json.query) {
      case 'object':
        if (!('match' in json.query)) {
          throw new TypeError();
        }
        match = json.query.match;
        if ('filter' in json.query) {
          if (typeof json.query.filter != 'string') {
            throw new TypeError();
          } 
          filter = json.query.filter;
        }
        break;
      case 'function':
        match = json.query;
        break;
      default:
        throw new TypeError();
    }
    return new QueryActionParameter(
      filter, match
    );
  }
  return null
};


module.exports = QueryActionParameter;