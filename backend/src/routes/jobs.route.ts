import express from "express";
import { Queue } from "bullmq";
import connection from "../config/redis";
import { startETLWorker } from "../worker";

const router = express.Router();
const etlQueue = new Queue("etl", { connection });
const emailQueue = new Queue("email", { connection });
const backupQueue = new Queue("backup", { connection });

type JobState = "waiting" | "processing" | "completed" | "failed";

type JobType = {
  id: string;
  name: string;
  data: {};
  status: JobState;
  startTime: any;
  endTime: any;
  returnvalue: any;
  createdAt: string;
  processedOn: any;
  finishedOn: any;
  progress: any;
  failedReason: any;
  timestamp: any;
};

const formatJobDetails = (job: JobType) => {
  const {
    id,
    name,
    data,
    progress,
    returnvalue,
    failedReason,
    finishedOn,
    processedOn,
    timestamp,
  } = job;
  const status = () => {
    if (!processedOn) return "waiting";
    if (finishedOn) return "completed";
    if (failedReason) return "failed";
    if (progress) return "active";
  };

  return {
    id,
    name,
    data,
    status: status(),
    startTime: progress?.startTime || null,
    endTime:
      progress?.endTime ||
      (finishedOn ? new Date(finishedOn).toISOString() : null),
    failedReason,
    returnvalue,
    createdAt: new Date(timestamp).toISOString(),
    processedOn: processedOn ? new Date(processedOn).toISOString() : null,
    finishedOn: finishedOn ? new Date(finishedOn).toISOString() : null,
  };
};

router.post("/startETL", async (req, res) => {
  startETLWorker();

  const job = await etlQueue.add("etl", req.body);
  res.json({ jobId: job.id });
});

router.post("/startBackup", async (req, res) => {
  const job = await backupQueue.add("backup", req.body);
  res.json({ jobId: job.id });
});

router.post("/sendEmail", async (req, res) => {
  const job = await emailQueue.add("email", req.body);
  res.json({ jobId: job.id });
});

router.get("/jobs", async (req, res) => {
  const etlJobs = await etlQueue.getJobs(
    ["waiting", "active", "completed", "failed", "delayed"],
    0,
    100
  );
  const backupJobs = await backupQueue.getJobs(
    ["waiting", "active", "completed", "failed", "delayed"],
    0,
    100
  );
  const emailJobs = await emailQueue.getJobs(
    ["waiting", "active", "completed", "failed", "delayed"],
    0,
    100
  );

  const jobs = [
    ...etlJobs.map((job) => formatJobDetails(job as unknown as JobType)),
    ...backupJobs.map((job) => formatJobDetails(job as unknown as JobType)),
    ...emailJobs.map((job) => formatJobDetails(job as unknown as JobType)),
  ];

  res.json(jobs);
});

router.get("/queue-info", async (req, res) => {
  const etlJobCounts = await etlQueue.getJobCounts();
  const backupJobCounts = await backupQueue.getJobCounts();
  const emailJobCounts = await emailQueue.getJobCounts();

  res.json({ etlJobCounts, backupJobCounts, emailJobCounts });
});

router.get("/job/:queue/:id", async (req, res) => {
  const { queue, id } = req.params;
  let job;

  if (queue === "etl") job = await etlQueue.getJob(id);
  if (queue === "backup") job = await backupQueue.getJob(id);
  if (queue === "email") job = await emailQueue.getJob(id);

  if (job) {
    res.json(formatJobDetails(job as unknown as JobType));
  } else {
    res.status(404).send("Job not found");
  }
});

router.post("/stop-job/:queue/:id", async (req, res) => {
  const { queue, id } = req.params;
  let job;

  if (queue === "etl") job = await etlQueue.getJob(id);
  if (queue === "backup") job = await backupQueue.getJob(id);
  if (queue === "email") job = await emailQueue.getJob(id);

  if (job && (await job.isWaiting())) {
    await job.remove();
    res.send(`Job ${id} from queue ${queue} stopped and removed`);
  } else {
    res.status(404).send("Job not found or already processed");
  }
});

export default router;
