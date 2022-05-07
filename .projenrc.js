const { javascript, SampleFile, JsonFile } = require("projen");
const { JobPermission } = require("projen/lib/github/workflows-model");

const GRAMMAR_NAME = "cool-lang";

const project = new javascript.NodeProject({
  defaultReleaseBranch: "main",
  name: "tree-sitter-test",
  devDeps: ["tree-sitter-cli", "nan"],
  releaseToNpm: true,
});

new JsonFile(project, "jsconfig.json", {
  obj: {
    compilerOptions: {
      checkJs: true,
      module: "CommonJS",
    },
    include: ["**/*.js", "node_modules/tree-sitter-cli/dsl.d.ts"],
  },
});

new SampleFile(project, "grammar.js", {
  contents: `\
module.exports = grammar({
  name: "cool-lang",

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => repeat(choice($.identifier, ";")),
    identifier: ($) => /[a-z0-9]+/,
  },
});  
`,
});

new SampleFile(project, "queries/highlights.scm", {
  contents: `\
(identifier) @variable
`,
});

project.addTask("generate", {
  exec: "tree-sitter generate",
});

project.testTask.reset("tree-sitter test");

project.addFields({
  // https://tree-sitter.github.io/tree-sitter/syntax-highlighting#language-configuration
  "tree-sitter": {
    scope: `source.${GRAMMAR_NAME}`,
  },
});

project.release.addJobs({
  release_crate: {
    permissions: {
      contents: JobPermission.READ,
    },
    runsOn: ["ubuntu-latest"],
    steps: [
      {
        uses: "actions-rs/toolchain@v1",
        with: {
          toolchain: "stable",
          override: true,
        },
      },
      {
        uses: "actions/download-artifact@v2",
        with: {
          name: "build-artifact",
          path: "dist",
        },
      },
      {
        uses: "katyo/publish-crates@v1",
        with: {
          "registry-token": "${{ secrets.CRATE_TOKEN}}",
        },
      },
    ],
  },
});

new JsonFile(project, ".eslintrc.json", {
  marker: false,
  obj: {
    root: true,
    extends: ["eslint:recommended"],
    plugins: ["prettier"],
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_|^\\$$",
        },
      ],
    },
    parserOptions: {
      ecmaVersion: "latest",
    },
    ignorePatterns: ["!.projenrc.js"],
    env: {
      commonjs: true,
    },
    globals: {
      grammar: "readonly",
      repeat: "readonly",
      repeat1: "readonly",
      seq: "readonly",
      prec: "readonly",
      choice: "readonly",
      optional: "readonly",
      token: "readonly",
      field: "readonly",
      alias: "readonly",
      require: "readonly",
    },
  },
});
project.addDevDeps("eslint", "eslint-plugin-prettier", "prettier");

project.synth();
