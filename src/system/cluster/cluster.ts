import cluster from "node:cluster";
import config from "@config";
import logger from "@logger";

const numCpus = config.application.cluster.amount;

export class ClusterFactory {
    static clusterize(callback: Function) {
        if (!config.application.cluster.enable) {
            callback();
            return;
        }
        if (cluster.isWorker) {
            callback();
            logger.debug("Cluster server started");
            return;
        }

        logger.debug("Master server started");
        for (let i = 0; i < numCpus; i++) {
            cluster.fork();
        }

        cluster.on("exit", (worker, code, signal) => {
            logger.fatal("Worker died. Restarting");
            cluster.fork();
        });
    }
}
