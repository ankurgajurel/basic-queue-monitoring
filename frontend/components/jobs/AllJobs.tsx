import { DataTableDemo, JobType } from "./JobTable";

async function getAllJobs() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}/jobs`,
    { next: { revalidate: 5 } }
  );
  const data = await res.json();
  return data;
}

export default async function AllJobs() {
  const data: JobType[] = await getAllJobs();

  return (
    <div className="py-20 px-10">
      <DataTableDemo
        data={
          data
            ? data.map((item: JobType) => ({
                ...item,
                returnvalue: "success",
              }))
            : [
                {
                  id: "1",
                  name: "test",
                  status: "completed",
                  startTime: "2021-08-17T09:00:00.000Z",
                  endTime: "2021-08-17T09:00:00.000Z",
                  returnvalue: "success",
                  createdAt: "2021-08-17T09:00:00.000Z",
                  processedOn: "2021-08-17T09:00:00.000Z",
                  finishedOn: "2021-08-17T09:00:00.000Z",
                },
              ]
        }
      />
    </div>
  );
}
