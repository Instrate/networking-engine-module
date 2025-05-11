import { defineConfig, globalIgnores } from "eslint/config";
import ignore from "./.style/ignore.default.mjs";
import { JsConfig, JsonConfig, TsConfig } from "style-eslint/lint.mjs";
import path from "node:path";

const stylesFolder = "./.style";

const ignoreMainList = ignore.retrieveIgnoreList();

const ignoreStylesList = ignore
    .retrieveIgnoreList(path.join(stylesFolder, ".gitignore"))
    .map((rule) => path.join(stylesFolder, rule));

const ignoreList = ignoreMainList
    .concat(ignoreStylesList)
    .concat([".obsidian/", stylesFolder]);

export default defineConfig([
    globalIgnores(ignoreList),
    JsConfig,
    TsConfig,
    JsonConfig
]);
