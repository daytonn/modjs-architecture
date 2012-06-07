//## Existence
// Provides convenience methods to determine the existence and
// identity of variables.

//### isDefined
// Convenience method to detect defined status
isDefined = function(suspect) {
  var isDefined = true;
  if (suspect === null || typeof suspect === "undefined") {
    isDefined = false;
  }
  return isDefined;
};

//### isUndefined
// Convenience function to detect undefined status
isUndefined = function(suspect) {
  var isUndefined = false;
  if (suspect === null || typeof suspect === "undefined") {
    isUndefined = true;
  }
  return isUndefined;
};

//### isTypeof
// Strict type checking against the `suspect`'s constructor
isTypeof = function(type, suspect) {
  if (isUndefined(type)) {
    throw new Error("isTypeof(Type, suspect): type is undefined");
  }

  if (isUndefined(suspect)) {
    throw new Error("isTypeof(Type, suspect): suspect is undefined");
  }

  return suspect.constructor == type ? true : false;
};

//### isNumeric
// Determines `suspect` holds a numeric value
isNumeric = function(suspect) {
  if (isNaN(suspect)) {
    return false;
  }
  return !isNaN(parseFloat(suspect)) && isFinite(suspect);
};

//### isString
// Alias method for String detection
isString = function(suspect) {
  return isTypeof(String, suspect);
};

//### isArray
// Alias method for Array detection
isArray = function(suspect) {
  return isTypeof(Array, suspect);
};

//### isNumber
// Alias method for Number detection
isNumber = function(suspect) {
  return isTypeof(Number, suspect);
};

//### isDate
// Alias method for Date detection
isDate = function(suspect) {
  return isTypeof(Date, suspect);
};

//### is_bool
// Alias method for Boolean detection
is_bool = function(suspect) {
  return isTypeof(Boolean, suspect);
};

//### isRegExp
// Alias method for RegExp detection
isRegExp = function(suspect) {
  return isTypeof(RegExp, suspect);
};

//### isEmpty
// Convenience method to detect whether the `suspect` is empty
isEmpty = function(suspect) {
  if (isUndefined(suspect)) {
    return true;
  }

  return suspect.length === 0;
};

//### isNotEmpty
// Convenience method to detect whether the `suspect` is not empty
isNotEmpty = function(suspect) {
  return suspect.length >= 1;
};
