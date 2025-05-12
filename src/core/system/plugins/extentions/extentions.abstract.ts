import { IExtentionsModule } from "./extentions.interface";
import {
    IInjectableModule,
    TMetaModule
} from "@core/system/plugins/plugins.interface";

export abstract class AExtentionsModule implements IExtentionsModule {}

export type TExtention = TMetaModule<IInjectableModule<AExtentionsModule>>;
