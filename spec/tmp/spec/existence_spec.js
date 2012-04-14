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

  it("should test for existence with is_defined", function() {
    expect(is_defined).toBeTruthy();
    expect(is_defined(undef)).toBeFalsy();
    expect(is_defined(empty_string)).toBeTruthy();
  });

  it("should test for existence with is_undefined", function() {
    expect(is_undefined).toBeTruthy();
    expect(is_undefined(undef)).toBeTruthy();
    expect(is_undefined(empty_string)).toBeFalsy();
  });

  it("should check for strict types with is_typeof", function() {
    expect(is_typeof).toBeTruthy();
    expect(is_typeof(String, empty_string)).toBeTruthy();
    expect(is_typeof(Array, empty_array)).toBeTruthy();
    expect(is_typeof(CustomClass, custom_object)).toBeTruthy();
  });

  it("should test for numeric values with is_numeric", function() {
    expect(is_numeric(neg_int_string)).toBeTruthy();
    expect(is_numeric(zero_string)).toBeTruthy();
    expect(is_numeric(number)).toBeTruthy();
    expect(is_numeric(neg_int)).toBeTruthy();
    expect(is_numeric(zero)).toBeTruthy();
    expect(is_numeric(oct_int_string)).toBeTruthy();
    expect(is_numeric(oct_int)).toBeTruthy();
    expect(is_numeric(hex_int)).toBeTruthy();
    expect(is_numeric(neg_float)).toBeTruthy();
    expect(is_numeric(pos_float)).toBeTruthy();
    expect(is_numeric(exp)).toBeTruthy();
    expect(is_numeric(exp_string)).toBeTruthy();

    expect(is_numeric(empty_string)).toBeFalsy();
    expect(is_numeric(whitespace)).toBeFalsy();
    expect(is_numeric(tabs)).toBeFalsy();
    expect(is_numeric(alpha_num)).toBeFalsy();
    expect(is_numeric(alpha)).toBeFalsy();
    expect(is_numeric(bool_true)).toBeFalsy();
    expect(is_numeric(bool_false)).toBeFalsy();
    expect(is_numeric(mix_string_num)).toBeFalsy();
    expect(is_numeric(NaN)).toBeFalsy();
    expect(is_numeric(Infinity)).toBeFalsy();
    expect(is_numeric(Number.POSITIVE_INFINITY)).toBeFalsy();
    expect(is_numeric(Number.NEGATIVE_INFINITY)).toBeFalsy();
    expect(is_numeric(date)).toBeFalsy();
    expect(is_numeric(obj)).toBeFalsy();
    expect(is_numeric(func)).toBeFalsy();
  });

  it("should test for strings with is_string", function() {
    expect(is_string).toBeTruthy();
    expect(is_string(empty_string)).toBeTruthy();
    expect(is_string(empty_array)).toBeFalsy();
    expect(is_string(custom_object)).toBeFalsy();
  });

  it("should test for arrays with is_array", function() {
    expect(is_array).toBeTruthy();
    expect(is_array(empty_array)).toBeTruthy();
    expect(is_array(empty_string)).toBeFalsy();
  });

  it("should test for numbers with is_number", function() {
    expect(is_number).toBeTruthy();
    expect(is_number(number)).toBeTruthy();
    expect(is_number(number_string)).toBeFalsy();
    expect(is_number(empty_string)).toBeFalsy();
  });

  it("should test for date objects with is_date", function() {
    expect(is_date).toBeTruthy();
    expect(is_date(date)).toBeTruthy();
    expect(is_date(empty_string)).toBeFalsy();
  });

  it("should test for boolean values with is_bool", function() {
    expect(is_bool).toBeTruthy();
    expect(is_bool(bool_true)).toBeTruthy();
    expect(is_bool(bool_false)).toBeTruthy();
    expect(is_bool(one)).toBeFalsy();
    expect(is_bool(zero)).toBeFalsy();
  });

  it("should test for RegEx objects with is_regex", function() {
    expect(is_regex).toBeTruthy();
    expect(is_regex(pattern)).toBeTruthy();
    expect(is_regex(empty_string)).toBeFalsy();
  });

  it("should test for emptiness with is_empty", function() {
    expect(is_empty).toBeTruthy();
    expect(is_empty(empty_string)).toBeTruthy();
    expect(is_empty(empty_array)).toBeTruthy();
    expect(is_empty(array)).toBeFalsy();
    expect(is_empty(string)).toBeFalsy();
  });

  it("should test for emptiness with is_not_empty", function() {
    expect(is_not_empty).toBeTruthy();
    expect(is_not_empty(empty_string)).toBeFalsy();
    expect(is_not_empty(empty_array)).toBeFalsy();
    expect(is_not_empty(array)).toBeTruthy();
    expect(is_not_empty(string)).toBeTruthy();
  });
});