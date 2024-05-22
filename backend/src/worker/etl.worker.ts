import { Worker } from "bullmq";
import connection from "../config/redis";

let etlWorker: Worker | null = null;

export const startETLWorker = () => {
  if (!etlWorker) {
    etlWorker = new Worker(
      "etl",
      async (job) => {
        try {
          const startTime = new Date().toISOString();
          console.log(`ETL job ${job.id} started at ${startTime}`);
          job.updateProgress({ startTime });

          await new Promise((resolve) => setTimeout(resolve, 60000));

          const endTime = new Date().toISOString();
          job.updateProgress({ endTime });

          console.log(`ETL job ${job.id} completed at ${endTime}`);

          return { success: true };
        } catch (error) {
          console.error(`Error in ETL job ${job.id}:`, error);
          throw error;
        }
      },
      { connection }
    );

    etlWorker.on("completed", (job) => {
      console.log(`ETL job ${job.id} has completed`);
    });

    etlWorker.on("failed", (job, err) => {
      console.log(`ETL job ${job?.id} has failed with error ${err.message}`);
    });

    console.log("ETL worker started");
  }
};

export const stopETLWorker = () => {
  if (etlWorker) {
    etlWorker.close();
    etlWorker = null;
    console.log("ETL worker stopped");
  }
};
