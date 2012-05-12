describe("Mod.js", function() {
  function CustomClass() {};
  var undef,
      empty_string = "",
      whitespace = "        ",
      tabs = "\t\t",
      string = "Hello World",
      alpha = "xabcdefx",
      alpha_num = "abcdefghijklm1234567890",
      empty_array = [],
      array = ['one', 'two', 'three'],
      custom_object = new CustomClass,
      number_string = "42",
      mix_string_num = "bcfed5.2",
      oct_int_string = "040",
      oct_int = 0144,
      hex_int_string = "0xFF",
      hex_int = 0xFFF,
      number = 42,
      neg_int = -16,
      neg_int_string = "-10",
      neg_float_string = "-1.6",
      pos_float_string = "4.536",
      neg_float = -2.6,
      pos_float = 3.1415,
      exp = 8e5,
      exp_string = "123e-2",
      zero_string = "0",
      obj = {},
      func = function() {},
      date = new Date,
      bool_true = true,
      bool_false = false,
      one = 1,
      zero = 0,
      pattern = /regex/;

  it("should test for existence with isDefined", function() {
    expect(isDefined).toBeTruthy();
    expect(isDefined(undef)).toBeFalsy();
    expect(isDefined(empty_string)).toBeTruthy();
  });

  it("should test for existence with isUndefined", function() {
    expect(isUndefined).toBeTruthy();
    expect(isUndefined(undef)).toBeTruthy();
    expect(isUndefined(empty_string)).toBeFalsy();
  });

  it("should check for strict types with isTypeof", function() {
    expect(isTypeof).toBeTruthy();
    expect(isTypeof(String, empty_string)).toBeTruthy();
    expect(isTypeof(Array, empty_array)).toBeTruthy();
    expect(isTypeof(CustomClass, custom_object)).toBeTruthy();
  });

  it("should test for numeric values with isNumeric", function() {
    expect(isNumeric(neg_int_string)).toBeTruthy();
    expect(isNumeric(zero_string)).toBeTruthy();
    expect(isNumeric(number)).toBeTruthy();
    expect(isNumeric(neg_int)).toBeTruthy();
    expect(isNumeric(zero)).toBeTruthy();
    expect(isNumeric(oct_int_string)).toBeTruthy();
    expect(isNumeric(oct_int)).toBeTruthy();
    expect(isNumeric(hex_int)).toBeTruthy();
    expect(isNumeric(neg_float)).toBeTruthy();
    expect(isNumeric(pos_float)).toBeTruthy();
    expect(isNumeric(exp)).toBeTruthy();
    expect(isNumeric(exp_string)).toBeTruthy();

    expect(isNumeric(empty_string)).toBeFalsy();
    expect(isNumeric(whitespace)).toBeFalsy();
    expect(isNumeric(tabs)).toBeFalsy();
    expect(isNumeric(alpha_num)).toBeFalsy();
    expect(isNumeric(alpha)).toBeFalsy();
    expect(isNumeric(bool_true)).toBeFalsy();
    expect(isNumeric(bool_false)).toBeFalsy();
    expect(isNumeric(mix_string_num)).toBeFalsy();
    expect(isNumeric(NaN)).toBeFalsy();
    expect(isNumeric(Infinity)).toBeFalsy();
    expect(isNumeric(Number.POSITIVE_INFINITY)).toBeFalsy();
    expect(isNumeric(Number.NEGATIVE_INFINITY)).toBeFalsy();
    expect(isNumeric(date)).toBeFalsy();
    expect(isNumeric(obj)).toBeFalsy();
    expect(isNumeric(func)).toBeFalsy();
  });

  it("should test for strings with isString", function() {
    expect(isString).toBeTruthy();
    expect(isString(empty_string)).toBeTruthy();
    expect(isString(empty_array)).toBeFalsy();
    expect(isString(custom_object)).toBeFalsy();
  });

  it("should test for arrays with isArray", function() {
    expect(isArray).toBeTruthy();
    expect(isArray(empty_array)).toBeTruthy();
    expect(isArray(empty_string)).toBeFalsy();
  });

  it("should test for numbers with isNumber", function() {
    expect(isNumber).toBeTruthy();
    expect(isNumber(number)).toBeTruthy();
    expect(isNumber(number_string)).toBeFalsy();
    expect(isNumber(empty_string)).toBeFalsy();
  });

  it("should test for date objects with isDate", function() {
    expect(isDate).toBeTruthy();
    expect(isDate(date)).toBeTruthy();
    expect(isDate(empty_string)).toBeFalsy();
  });

  it("should test for boolean values with is_bool", function() {
    expect(is_bool).toBeTruthy();
    expect(is_bool(bool_true)).toBeTruthy();
    expect(is_bool(bool_false)).toBeTruthy();
    expect(is_bool(one)).toBeFalsy();
    expect(is_bool(zero)).toBeFalsy();
  });

  it("should test for RegEx objects with isRegExp", function() {
    expect(isRegExp).toBeTruthy();
    expect(isRegExp(pattern)).toBeTruthy();
    expect(isRegExp(empty_string)).toBeFalsy();
  });

  it("should test for emptiness with isEmpty", function() {
    expect(isEmpty).toBeTruthy();
    expect(isEmpty(empty_string)).toBeTruthy();
    expect(isEmpty(empty_array)).toBeTruthy();
    expect(isEmpty(array)).toBeFalsy();
    expect(isEmpty(string)).toBeFalsy();
  });

  it("should test for emptiness with isNotEmpty", function() {
    expect(isNotEmpty).toBeTruthy();
    expect(isNotEmpty(empty_string)).toBeFalsy();
    expect(isNotEmpty(empty_array)).toBeFalsy();
    expect(isNotEmpty(array)).toBeTruthy();
    expect(isNotEmpty(string)).toBeTruthy();
  });
});