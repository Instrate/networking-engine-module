import { Injectable } from "@nestjs/common";
import { KitPluginService } from "@kit/plugins/plugin-kit.service";
import { DatabasePluginExtentionSettings } from "@plugins/database/database.configuration";
import {
    IPluginBehaviorArguments,
    IPluginService
} from "@core/system/plugins/plugins.interface";
import { Occasional } from "@core/types/global";
import { ModuleRef } from "@nestjs/core";
import { getInternalElementName } from "@core/system/plugins/util";

type TPluginConfig = Readonly<DatabasePluginExtentionSettings>;

// TODO: make ruleset to use __dirname:__filename elements names
//       create maybe a loading step for that
getInternalElementName(__filename);

@Injectable()
export class DatabaseService
    extends KitPluginService<TPluginConfig>
    implements IPluginService<TPluginConfig>
{
    public readonly settings!: TPluginConfig;

    constructor(protected readonly moduleRef: ModuleRef) {
        super(moduleRef);
    }

    // public async init<
    //     TData extends
    //         DatabasePluginExtentionInitArguments = DatabasePluginExtentionInitArguments,
    //     TArgs extends IPluginBehaviorArguments<
    //         TPluginConfig,
    //         Occasional<Object>
    //     > = IPluginBehaviorArguments<TPluginConfig, TData>
    // >(options: TPluginConfig["initConfig"], args?: TArgs) {
    //     console.log("initOptions: ", options);
    //
    //     const extsArr = args?.extentions || [];
    //     // TODO: fix type
    //     const ext: any = extsArr[0];
    //
    //     const extPrepared = ext?.initBefore?.(options);
    //     const superInitResult = null as any; // super.init(options, args as any);
    //     ext?.initAfter?.(options);
    //
    //     return {
    //         meta: {
    //             name: "DatabaseService",
    //             type: EServiceResponse.Done
    //         }
    //     };
    // }

    public async invoke<
        TData extends Occasional<Object> = Occasional<Object>,
        TArgs extends IPluginBehaviorArguments<TPluginConfig, TData> =
            IPluginBehaviorArguments<TPluginConfig, TData>
    >(options: TPluginConfig["invokeConfig"], args?: TArgs) {
        console.log(options);

        const extsArr = [] as any; // args?.extentions || [];
        // TODO: fix type
        const ext: any = extsArr[0];

        const extPrepared = ext?.invokeBefore?.(options);
        const superInvokeResult = super.invoke(options, args);
        ext?.invokeAfter?.(options);
    }

    public async destroy<
        TData extends Occasional<Object> = Occasional<Object>,
        TArgs extends IPluginBehaviorArguments<TPluginConfig, TData> =
            IPluginBehaviorArguments<TPluginConfig, TData>
    >(options: TPluginConfig["destroyConfig"], args?: TArgs) {
        console.log(options);

        const extsArr = [] as any;
        // TODO: fix type
        const ext: any = extsArr[0];

        const extPrepared = ext?.destroyBefore?.(options);
        const superDestroyResult = super.destroy(options, args);
        ext?.destroyAfter?.(options, args);
    }
}
