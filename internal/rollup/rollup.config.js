// Rollup configuration
// GENERATED BY Bazel

// Workaround https://github.com/bazelbuild/rules_nodejs/issues/25
// For Windows, we must deep-import the actual .js file, not rely on reading the "main" from package.json
const rollup = require('rollup/dist/rollup');
const nodeResolve = require('rollup-plugin-node-resolve/dist/rollup-plugin-node-resolve.cjs');
const commonjs = require('rollup-plugin-commonjs/dist/rollup-plugin-commonjs.cjs');

const path = require('path');

const binDirPath = "TMPL_bin_dir_path";
const workspaceName = "TMPL_workspace_name";
const buildFileDirname = "TMPL_build_file_dirname";
const labelName = "TMPL_label_name";

class NormalizePaths {
  resolveId(importee, importer) {
    // process.cwd() is the execroot and ends up looking something like /.../2c2a834fcea131eff2d962ffe20e1c87/bazel-sandbox/872535243457386053/execroot/<workspace_name>
    // from that path to the es6 output is <bin_dir_path>/<build_file_path>/<label_name>.es6
    var resolved;
    if (importee.startsWith(`${workspaceName}/`)) {
      // workspace import
      resolved = `${process.cwd()}/${binDirPath}/${buildFileDirname}/${labelName}.es6/${importee.replace(`${workspaceName}/`, "")}`;
    } else if (importee.startsWith(`./`) || importee.startsWith(`../`)) {
      // relative import
      resolved = path.join(importer ? path.dirname(importer) : '', importee);
    }
    // add .js extension if needed
    if (resolved) {
      if (!resolved.endsWith(".js")) {
        resolved += ".js";
      }
      return resolved;
    }
  }
}

export default {
  output: {format: 'iife'},
  plugins: [
      new NormalizePaths(),
      commonjs(),
      nodeResolve({jsnext: true, module: true}),
    ]
}