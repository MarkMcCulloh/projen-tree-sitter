import { JsiiProject } from "projen/lib/cdk";

const project = new JsiiProject({
  defaultReleaseBranch: "main",
  name: "projen-tree-sitter",
  author: "Mark McCulloh",
  authorAddress: "markm@monada.co",
  repositoryUrl: "https://github.com/MarkMcCulloh/projen-tree-sitter.git",

  jest: false,

  releaseToNpm: true,
  peerDeps: ["projen"],
  projenrcTs: true,
  eslintOptions: {
    dirs: ["src", ".projenrc.ts"],
    prettier: true,
  },
});

project.synth();
