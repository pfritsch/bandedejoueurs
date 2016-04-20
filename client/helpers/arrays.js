Array.prototype.contains = function ( property, needle ) {
  var retVal = -1;
  var self = this;
  for(var index=0; index < self.length; index++){
      var item = self[index];
      if (item.hasOwnProperty(property)) {
          if (item[property].toLowerCase() === needle.toLowerCase()) {
              retVal = index;
              return retVal;
          }
      }
  };
  return retVal;
}

isUndefinedKey = function (object, key) {
  if(!object) return true;
  var keyChain = Array.isArray(key) ? key : key.split('.'),
      objectHasKey = keyChain[0] in object,
      keyHasValue = typeof object[keyChain[0]] !== 'undefined';

  if (objectHasKey && keyHasValue) {
    if (keyChain.length > 1) {
      return isUndefinedKey(object[keyChain[0]], keyChain.slice(1));
    }
    return false;
  }
  else {
    return true;
  }
}
