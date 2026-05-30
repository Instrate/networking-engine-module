import {
    IApiControllerInterface,
    IApiServiceInterface
} from "@core/app/controllers/api/api.interface";

export interface IApiV1ServiceInterface extends IApiServiceInterface {
    testPing: () => {
        server_time: number;
        memory: {
            total: number;
            free: number;
        };
    };
}

type TApiV1ControllerInterface =
    IApiControllerInterface<IApiV1ServiceInterface>;

export interface IApiV1ControllerInterface extends TApiV1ControllerInterface {}
