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
};

type JobState = "waiting" | "processing" | "completed" | "failed";

export type { JobType, JobState };
