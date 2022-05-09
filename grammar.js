module.exports = grammar({
  name: "example",

  // Comments and whitespace can appear anywhere
  extras: ($) => [$.comment, /[\s\p]/],

  rules: {
    // TODO Put your rules here

    // Entire file is simply identifiers separated by semicolons
    source_file: ($) => repeat(choice($.identifier, ";")),

    // Alphanumeric identifier
    identifier: ($) => /[a-zA-Z0-9]+/,

    // Simple single-line comment
    comment: ($) => token(seq("//", /.*/)),
  },
});
