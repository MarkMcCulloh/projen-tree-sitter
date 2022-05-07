module.exports = grammar({
  name: "cool-lang",

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => repeat(choice($.identifier, ";")),
    identifier: ($) => /[a-z0-9]+/,
  },
});
