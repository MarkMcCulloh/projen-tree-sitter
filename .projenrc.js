const { javascript, SampleFile, JsonFile } = require("projen");

const project = new javascript.NodeProject({
  defaultReleaseBranch: "main",
  name: "tree-sitter-test",
  devDeps: ["tree-sitter-cli", "nan"],
});

new JsonFile(project, "jsconfig.json", {
  obj: {
    compilerOptions: {
      checkJs: true,
    },
    include: ["*.js", "node_modules/tree-sitter-cli/dsl.d.ts"],
  },
});

new SampleFile(project, "grammar.js", {
  contents: `\
module.exports = grammar({
  name: "YOUR_LANGUAGE_NAME",

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => "hello",
  },
});
`,
});

project.addTask('generate', {
  exec: 'tree-sitter generate'
});

project.testTask.reset('tree-sitter test');

project.synth();
