import { JobState } from "@/types/job.type";

type Props = {
  jobState: JobState;
};

export default function JobStateComponent({ jobState }: Props) {
  // type JobState = "waiting" | "processing" | "completed" | "failed";

  console.log(jobState);

  const color = () => {
    switch (jobState.toLowerCase()) {
      case "active":
        return "bg-blue-500";
      case "waiting":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
    }
  };

  return (
    <div className={`text-xs text-white text-center min-w-[70px] px-3 py-1 rounded-full w-fit ${color()}`}>
      {jobState}
    </div>
  );
}
