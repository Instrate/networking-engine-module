import {
    IPluginService,
    IPluginSettings
} from "@core/system/plugins/plugins.interface";
import { ClassConstructor } from "class-transformer";
import { validateSchemaThrowable } from "@core/system/validator";

export abstract class APluginService<
    TPluginConfiguration extends IPluginSettings = IPluginSettings
> implements IPluginService<TPluginConfiguration>
{
    abstract settings: TPluginConfiguration;

    private validateProvidedArguments<TKey extends keyof TPluginConfiguration>(
        options: TKey | unknown,
        schema?: ClassConstructor<TKey> | Function
    ) {
        if (!schema) {
            return;
        }
        validateSchemaThrowable(options, schema as ClassConstructor<TKey>);
    }

    getVersion() {
        return "unspecified";
    }

    init(options: TPluginConfiguration["initConfig"]): Promise<void> | void {
        this.validateProvidedArguments(
            options,
            this.settings.initConfig?.constructor
        );
        return undefined;
    }

    invoke(
        options: TPluginConfiguration["invokeConfig"]
    ): Promise<void> | void {
        this.validateProvidedArguments(
            options,
            this.settings.invokeConfig?.constructor
        );
        return undefined;
    }

    destroy(
        options: TPluginConfiguration["destroyConfig"]
    ): Promise<void> | void {
        this.validateProvidedArguments(
            options,
            this.settings.destroyConfig?.constructor
        );
        return undefined;
    }
}
