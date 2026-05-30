import { PromiseLike } from "@core/types/global";
import { TResponse } from "@core/app/app.types";

export interface IApiServiceInterface {
    testPing: () => PromiseLike<unknown>;
}

export interface IApiControllerInterface<
    TIApiService extends IApiServiceInterface = IApiServiceInterface
> {
    testPing: (
        ...args: any[]
    ) => PromiseLike<TResponse<ReturnType<TIApiService["testPing"]>>>;
}
