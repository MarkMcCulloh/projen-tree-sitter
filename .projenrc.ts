import { JsiiProject } from "projen/lib/cdk";

const project = new JsiiProject({
  defaultReleaseBranch: "main",
  author: "Mark McCulloh",
  authorAddress: "",
  repositoryUrl: "",
  name: "projen-tree-sitter",
  releaseToNpm: true,
  peerDeps: ["projen"],
  projenrcTs: true,
  repository: "https://github.com/MarkMcCulloh/projen-tree-sitter",
  eslintOptions: {
    dirs: ["src", ".projenrc.ts"],
    prettier: true,
  },
});

project.synth();
