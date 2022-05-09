import { JsonFile, SampleFile } from "projen";
import { JobPermission } from "projen/lib/github/workflows-model";
import { NodeProject, NodeProjectOptions } from "projen/lib/javascript";

export interface TreeSitterGrammarProjectOptions extends NodeProjectOptions {
    readonly grammarName?: string;
}

/**
 * Creates a tree-sitter grammar
 * 
 * @pjid tree-sitter-grammar
 */
export class TreeSitterGrammarProject extends NodeProject {
    constructor(props: TreeSitterGrammarProjectOptions) {
        super({
            ...props
        });

        const grammarName = props.grammarName ?? 'example';
        
        this.addDevDeps("eslint", "eslint-plugin-prettier", "prettier", "tree-sitter-cli", "nan");

        new JsonFile(this, "jsconfig.json", {
            obj: {
              compilerOptions: {
                checkJs: true,
                module: "CommonJS",
              },
              include: ["**/*.js", "node_modules/tree-sitter-cli/dsl.d.ts"],
            },
          });
          
          new SampleFile(this, "grammar.js", {
            contents: `\
          module.exports = grammar({
            name: "${grammarName}",
          
            // Comments and whitespace can appear anywhere
            extras: ($) => [$.comment, /[\\s]/],
          
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
          `,
          });
          
          new SampleFile(this, "queries/highlights.scm", {
            contents: `\
          (identifier) @variable
          (comment) @comment  
          `,
          });
          
          new SampleFile(this, "examples/test.example", {
            contents: `\
          just;
          
          some;
          
          // with a comment
          identifiers;  
          `,
          });
          
          new SampleFile(this, "test/corpus/test.example", {
            contents: `\
          =====
          Example Test
          =====
          
          just;
          
          some;
          
          // with a comment
          identifiers;
          
          
          ---
          
          (source_file
            (identifier)
            (identifier)
            (comment)
            (identifier))  
          `,
          });
          
          new SampleFile(this, "test/highlight/test.example", {
            contents: `\
          ; Identifiers
          ;-------
          
          cool;
          // <- variable  
          `,
          });
          
          this.addTask("generate", {
            exec: "tree-sitter generate",
          });
          
          this.testTask.reset("tree-sitter test");
          
          this.addTask("parse-test", {
            exec: "tree-sitter parse test/**/*.example",
          });
          
          this.addFields({
            main: "bindings/node",
          
            // https://tree-sitter.github.io/tree-sitter/syntax-highlighting#language-configuration
            "tree-sitter": [
              {
                scope: `source.${grammarName}`,
                "file-types": ["example"],
                highlights: ["queries/highlights.scm"],
              },
            ],
          });
          
          this.release.addJobs({
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
          
          new JsonFile(this, ".eslintrc.json", {
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
    }
}