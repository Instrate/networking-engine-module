import {
    ExecuteUnits,
    ExpectMatch,
    SpecUnitsResult,
    Unit,
    UnitPrefix
} from "$test/core";

import type { TUnitTestsArrayNamesToEnum } from "$test/utils";

import {
    ApiVersionedModuleOptionsApproved,
    ApiVersionedModuleOptionsProperties,
    FilteredControllers,
    FilteredProviders,
    ForbiddenControllers,
    ForbiddenExports,
    ForbiddenProviders,
    SearchForControllerServicePair,
    TIncompatibleInjection
} from "@core/app/app.types";

import { ApiV1Service } from "@core/app/controllers/api/api.v1.service";
import { PluginManagerService } from "@core/system/plugins/plugin-manager.service";
import { ApiV1Controller } from "@core/app/controllers/api/api.v1.controller";
import { Mutable } from "@core/types/global";

// TODO: create mocking services
// TODO: create tests for utility types

type UnitModuleName = UnitPrefix<"NestModule">;

type TPreparedTestsNames = [
    "Utility_ForbiddenControllers_Fault",
    "Utility_ForbiddenControllers_Pass",
    "Utility_ForbiddenProviders_Pass",
    "Utility_ForbiddenExports_Fault",

    "Utility_FilteredProviders",
    "Utility_FilteredControllers",

    "Utility_SearchForControllerServicePair_Pass",

    "Empty",
    "ControllerAsProvider",
    "ProviderAsController",
    "ProviderLeakToExport",
    "CorrectServiceController"
];

type TPreparedTest =
    // ^?
    TUnitTestsArrayNamesToEnum<TPreparedTestsNames, UnitModuleName>;

// INFO: utility type tests
type TUtility_ForbiddenController_Fault =
    // ^?
    Unit<
        TPreparedTest["Utility_ForbiddenControllers_Fault"],
        ExpectMatch<
            ForbiddenControllers<
                Mutable<
                    [
                        typeof ApiV1Service,
                        typeof ApiV1Controller,
                        typeof PluginManagerService
                    ]
                >
            >,
            [typeof ApiV1Service, typeof PluginManagerService]
        >
    >;

type TUtility_ForbiddenController_Pass =
    // ^?
    Unit<
        TPreparedTest["Utility_ForbiddenControllers_Pass"],
        ExpectMatch<ForbiddenControllers<[typeof ApiV1Controller]>, never>
    >;

type TUtility_ForbiddenProviders_Pass =
    // ^?
    Unit<
        TPreparedTest["Utility_ForbiddenProviders_Pass"],
        ExpectMatch<
            ForbiddenProviders<
                [
                    typeof ApiV1Service,
                    typeof ApiV1Controller,
                    typeof PluginManagerService
                ]
            >,
            [typeof ApiV1Controller]
        >
    >;

type TUtility_ForbiddenExports_Fault =
    // ^?
    Unit<
        TPreparedTest["Utility_ForbiddenExports_Fault"],
        ExpectMatch<
            ForbiddenExports<
                [
                    typeof ApiV1Service,
                    typeof ApiV1Controller,
                    typeof PluginManagerService
                ]
            >,
            [typeof ApiV1Service, typeof ApiV1Controller]
        >
    >;

type TUtility_FilteredProviders =
    // ^?
    Unit<
        TPreparedTest["Utility_FilteredProviders"],
        ExpectMatch<
            FilteredProviders<
                [
                    typeof ApiV1Service,
                    typeof ApiV1Controller,
                    typeof PluginManagerService
                ]
            >,
            [typeof ApiV1Service]
        >
    >;

type TUtility_FilteredControllers =
    // ^?
    Unit<
        TPreparedTest["Utility_FilteredControllers"],
        ExpectMatch<
            FilteredControllers<
                [
                    typeof ApiV1Service,
                    typeof ApiV1Controller,
                    typeof PluginManagerService
                ]
            >,
            [typeof ApiV1Controller]
        >
    >;

type TUtility_SearchForControllerServicePair_Pass =
    // ^?
    Unit<
        TPreparedTest["Utility_SearchForControllerServicePair_Pass"],
        ExpectMatch<
            SearchForControllerServicePair<
                typeof ApiV1Controller,
                [typeof ApiV1Service]
            >,
            true
        >
    >;

// INFO: final type test
type TSpecApiVersionedModuleOptions_Empty =
    // ^?
    Unit<
        TPreparedTest["Empty"],
        ExpectMatch<
            ApiVersionedModuleOptionsProperties<[], [], []>,
            ApiVersionedModuleOptionsApproved
        >
    >;

type TSpecApiVersionedModuleOptions_ControllerAsProvider =
    //  ^?
    Unit<
        TPreparedTest["ControllerAsProvider"],
        ExpectMatch<
            ApiVersionedModuleOptionsProperties<
                [],
                [typeof ApiV1Controller],
                []
            >,
            TIncompatibleInjection<"providers">
        >
    >;

type TSpecApiVersionedModuleOptions_ProviderAsController =
    //  ^?
    Unit<
        TPreparedTest["ProviderAsController"],
        ExpectMatch<
            ApiVersionedModuleOptionsProperties<[typeof ApiV1Service], [], []>,
            TIncompatibleInjection<"controllers">
        >
    >;

type TSpecApiVersionedModuleOptions_ProviderLeakToExport =
    //  ^?
    Unit<
        TPreparedTest["ProviderLeakToExport"],
        ExpectMatch<
            ApiVersionedModuleOptionsProperties<
                [],
                [typeof ApiV1Service, typeof PluginManagerService],
                [typeof ApiV1Service, typeof PluginManagerService]
            >,
            TIncompatibleInjection<"exports">
        >
    >;

type TSpecApiVersionedModuleOptions_CorrectServiceController =
    //    ^?
    Unit<
        TPreparedTest["CorrectServiceController"],
        ExpectMatch<
            ApiVersionedModuleOptionsProperties<
                [typeof ApiV1Controller],
                [typeof ApiV1Service, typeof PluginManagerService],
                [typeof PluginManagerService]
            >,
            ApiVersionedModuleOptionsApproved
        >
    >;

export type TSpecModuleResult = SpecUnitsResult<
    UnitModuleName,
    ExecuteUnits<
        [
            TUtility_ForbiddenController_Fault,
            TUtility_ForbiddenController_Pass,
            TUtility_ForbiddenProviders_Pass,
            TUtility_ForbiddenExports_Fault,

            TUtility_FilteredProviders,
            TUtility_FilteredControllers,

            TUtility_SearchForControllerServicePair_Pass,

            TSpecApiVersionedModuleOptions_Empty,
            TSpecApiVersionedModuleOptions_ControllerAsProvider,
            TSpecApiVersionedModuleOptions_ProviderAsController,
            TSpecApiVersionedModuleOptions_ProviderLeakToExport,
            TSpecApiVersionedModuleOptions_CorrectServiceController
        ]
    >
>;
