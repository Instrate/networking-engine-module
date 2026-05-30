import { StartModule } from "@core/start.module";
import { ClusterFactory } from "@core/system/cluster/cluster";

ClusterFactory.clusterize(StartModule.bootstrap.bind(StartModule));
