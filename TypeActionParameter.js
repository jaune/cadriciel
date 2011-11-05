var MIMETYPE_PATERN = /^([-_a-z0-9]+)\u002f([-_a-z0-9]+)([ ]*;.*)?$/i;

function TypeActionParameter(){
  this.type = '';
  this.subtype = '';
};

TypeActionParameter.prototype.match = function (context) {
  if (context.type == this.type && context.subtype == this.subtype) {
    return true;
  }
  return false;
};

TypeActionParameter.parse = function (json) {
  if (!('type' in json)) {
    return null;
  }
  var parameter = new TypeActionParameter();
  switch (typeof json.type) {
    case 'string':
      var result = MIMETYPE_PATERN.exec(json.type);
      if (!result) {
        throw new TypeError();
      }
      parameter.type = result[1];
      parameter.subtype = result[2];
      break;
    default:
      throw new TypeError();
  }
  return parameter;
};

module.exports = TypeActionParameter;