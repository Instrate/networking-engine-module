import fs from "fs";
import path from "node:path";
import { IConfig } from "./types";
import { validateSchemaThrowable } from "../system/validator";

const configDir = path.join(__dirname, "../../config");

function getConfigFiles(files: string[], exts: string[] = [".json"]) {
    return files.filter((file) => exts.some((ext) => file.endsWith(ext)));
}

function createConfigRecordNameToConfig(
    files: string[],
    dir: string = configDir
): Record<string, string> {
    return files.reduce(
        (res, file) => {
            const fileName = file
                .split(".")
                .reverse()
                .slice(1)
                .reverse()
                .join();

            const filePath = path.join(dir, file);

            res[fileName] = JSON.parse(fs.readFileSync(filePath).toString());
            return res;
        },
        {} as Record<string, string>
    );
}

class Config {
    public readonly data: IConfig;

    static singleton: Config;

    constructor() {
        if (!!Config.singleton) {
            return Config.singleton;
        }
        Config.singleton = this;
        this.data = this.load() as unknown as IConfig;
    }

    private load(): Record<string, string> {
        const files = fs.readdirSync(configDir);
        const configs = getConfigFiles(files);
        const parsed = createConfigRecordNameToConfig(configs);
        validateSchemaThrowable(parsed as any, IConfig);
        return parsed;
    }
}

const config = new Config().data;

export default config;
