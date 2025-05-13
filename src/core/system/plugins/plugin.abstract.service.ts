import {
    IPluginService,
    IPluginSettings
} from "@core/system/plugins/plugins.interface";
import { ClassConstructor } from "class-transformer";
import { validateSchemaThrowable } from "@core/system/validator";

export abstract class APluginService<
    TPluginConfiguration extends IPluginSettings
> implements IPluginService<TPluginConfiguration>
{
    abstract readonly settings: TPluginConfiguration;

    private validateProvidedArguments<TKey extends keyof TPluginConfiguration>(
        options: TKey | unknown,
        schema?: ClassConstructor<TKey> | Function
    ) {
        if (!schema) {
            return;
        }

        validateSchemaThrowable(options, schema as ClassConstructor<TKey>);
    }

    init(options: TPluginConfiguration["initConfig"]) {
        this.validateProvidedArguments(
            options,
            this.settings.initConfig?.constructor
        );
        return;
    }

    invoke(options: TPluginConfiguration["invokeConfig"]) {
        this.validateProvidedArguments(
            options,
            this.settings.invokeConfig?.constructor
        );
        return;
    }

    destroy(options: TPluginConfiguration["destroyConfig"]) {
        this.validateProvidedArguments(
            options,
            this.settings.destroyConfig?.constructor
        );
        return;
    }

    getVersion() {
        return "unspecified";
    }
}
