function MessageClass(name){
  /** @type string */
  this.name = name;
  
  /** @type object */
  this.fields = {}
}

MessageClass.prototype.setField = function (name, properties) {
  this.fields[name] = properties;
};

module.exports = MessageClass;
