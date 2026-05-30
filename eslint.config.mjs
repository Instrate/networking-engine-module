import { lint } from "instrate-style-preferences";

const ignoreList = [...lint.IgnoreListDefault, "logs/**/*", "doc/**/*.js"];

console.log(ignoreList);

export default lint.n18.defineConfig([
    lint.n18.globalIgnores(ignoreList),
    lint.n18.JsConfig,
    lint.n18.TsConfig,
    lint.n18.JsonConfig
]);
