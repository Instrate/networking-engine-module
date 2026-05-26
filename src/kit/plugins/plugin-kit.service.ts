import {
    IPluginBehaviorArguments,
    IPluginBehaviorResult,
    IPluginService,
    IPluginSettings
} from "@core/system/plugins/plugins.interface";
import { ClassConstructor } from "class-transformer";
import { validateSchemaThrowable } from "@core/system/validator";
import { TExtentionService } from "@core/system/plugins/extentions/extentions.interface";
import { Occasional } from "@core/types/global";
import { ModuleRef } from "@nestjs/core";

type TAPluginService<TPluginConfig extends IPluginSettings> = IPluginService<
    TPluginConfig,
    false
>;

export abstract class PluginKitService<
    TPluginConfig extends IPluginSettings = IPluginSettings
> implements IPluginService<TPluginConfig, false>
{
    abstract readonly settings: TPluginConfig;

    // TODO: resolve missing value

    protected async getDependenciesServicesFromTokens<T extends typeof this>(
        ...tokens: string[]
    ) {
        return Promise.all(
            tokens.map((token) => {
                return this.moduleRef.get<T>(token, { strict: false });
            })
        );
    }

    protected constructor(
        protected readonly moduleRef: ModuleRef,
        protected readonly dependenciesRefTokens: string[] = []
    ) {}

    private validateProvidedArguments<TKey extends keyof TPluginConfig>(
        options: TKey | unknown,
        schema?: ClassConstructor<TKey> | Function
    ) {
        if (!schema) {
            return;
        }

        validateSchemaThrowable(options, schema as ClassConstructor<TKey>);
    }

    protected getExtention(extsArr: TExtentionService<TPluginConfig>[] = []) {
        return extsArr;
    }

    // <
    //         TData extends Occasional<Object> = Occasional<Object>,
    //         R extends unknown = void,
    //         TArgs extends IPluginBehaviorArguments<
    //             TPluginConfig,
    //             Occasional<Object>
    //         > = IPluginBehaviorArguments<TPluginConfig, TData>
    //     >

    // init: TAPluginService<TPluginConfig>["init"];
    init: Function = (options: any, args: any, setup: any) => {
        this.validateProvidedArguments(
            options,
            this.settings?.initConfig?.constructor
        );

        return {};
    };

    invoke<
        TData extends Occasional<Object> = Occasional<Object>,
        R extends unknown = void,
        TArgs extends IPluginBehaviorArguments<
            TPluginConfig,
            TData
        > = IPluginBehaviorArguments<TPluginConfig, TData>
    >(
        options: TPluginConfig["invokeConfig"],
        args?: TArgs
    ): IPluginBehaviorResult<R> {
        this.validateProvidedArguments(
            options,
            this.settings?.invokeConfig?.constructor
        );
        return;
    }

    destroy<
        TData extends Occasional<Object> = Occasional<Object>,
        R extends unknown = void,
        TArgs extends IPluginBehaviorArguments<
            TPluginConfig,
            TData
        > = IPluginBehaviorArguments<TPluginConfig, TData>
    >(
        options: TPluginConfig["destroyConfig"],
        args?: TArgs
    ): IPluginBehaviorResult<R> {
        this.validateProvidedArguments(
            options,
            this.settings?.destroyConfig?.constructor
        );
        return;
    }

    getVersion() {
        return "unspecified";
    }
}
