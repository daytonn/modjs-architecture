is_defined = function(suspect) {
  return typeof suspect == "undefined" ? false : true;
};

is_undefined = function(suspect) {
  return typeof suspect == "undefined" ? true : false;
};

is_typeof = function(type, suspect) {
  if (is_undefined(type)) {
    throw new Error("is_typeof(Type, suspect): type is undefined");
  }

  if (is_undefined(suspect)) {
    throw new Error("is_typeof(Type, suspect): suspect is undefined");
  }

  return suspect.constructor == type ? true : false;
};

is_numeric = function(suspect) {
  if (isNaN(suspect)) {
    return false;
  }
  return !isNaN(parseFloat(suspect)) && isFinite(suspect);
};

is_string = function(suspect) {
  return is_typeof(String, suspect);
};

is_array = function(suspect) {
  return is_typeof(Array, suspect);
};

is_number = function(suspect) {
  return is_typeof(Number, suspect);
};

is_date = function(suspect) {
  return is_typeof(Date, suspect);
};

is_bool = function(suspect) {
  return is_typeof(Boolean, suspect);
};

is_regex = function(suspect) {
  return is_typeof(RegExp, suspect);
};

is_empty = function(suspect) {
  if (is_undefined(suspect)) {
    return true;
  }

  return suspect.length === 0;
};

is_not_empty = function(suspect) {
  return suspect.length >= 1;
};
