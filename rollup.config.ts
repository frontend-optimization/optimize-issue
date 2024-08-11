import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import html from "@rollup/plugin-html";
import { readFileSync } from "fs";

const pkg = require("./package.json");
const name = pkg.name;
const libraryName = "index";

export default {
  input: `./src/${libraryName}.ts`,
  output: [
    {
      file: `dist/${name}.umd.js`,
      name: libraryName,
      format: "umd",
      sourcemap: true,
    },
    { file: `dist/${name}.esm.js`, format: "es", sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ["lodash"],
  watch: {
    include: "src/**",
  },
  plugins: [
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow json resolution
    json(),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
      exclude: "node_modules",
    }),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    //
    resolve(),
    sourceMaps(),
    html({
      template: () => {
        return readFileSync("./index.html", "utf-8").toString();
      },
    }),
  ],
};
