import { JsiiProject } from "projen/lib/cdk";

const project = new JsiiProject({
  defaultReleaseBranch: "main",
  author: "Mark McCulloh",
  authorAddress: "markm@monada.co",
  repositoryUrl: "https://github.com/MarkMcCulloh/projen-tree-sitter.git",

  jest: false,

  name: "projen-tree-sitter",
  releaseToNpm: true,
  peerDeps: ["projen"],
  projenrcTs: true,
  eslintOptions: {
    dirs: ["src", ".projenrc.ts"],
    prettier: true,
  },
});

project.synth();
