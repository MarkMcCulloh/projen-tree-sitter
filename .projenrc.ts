import { JsiiProject } from "projen/lib/cdk";

const project = new JsiiProject({
  defaultReleaseBranch: "main",
  author: "Mark McCulloh",
  authorAddress: "",
  repositoryUrl: "",
  name: "projen-tree-sitter",
  releaseToNpm: true,
  projenDevDependency: false,
  peerDeps: ["projen"],
  projenrcTs: true,
  eslintOptions: {
    dirs: ["src", ".projenrc.ts"],
    prettier: true,
  },
});

project.synth();
