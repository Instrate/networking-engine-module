import { StartModule } from "@core/launch/start.module";
import { ClusterFactory } from "@core/system/cluster/cluster";

ClusterFactory.clusterize(StartModule.bootstrap.bind(StartModule));
