import { defineConfig, globalIgnores } from "eslint/config";
import ignore from "./.style/ignore.default.mjs";
import { JsConfig, JsonConfig, TsConfig } from "style-eslint/lint.mjs";

const ignoreList = ignore.retrieveIgnoreList();

export default defineConfig([
    globalIgnores(ignoreList),
    JsConfig,
    TsConfig,
    JsonConfig
]);
