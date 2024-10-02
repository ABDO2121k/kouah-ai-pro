import QueriesTable from "@/components/dashboard/query-log/query-table";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col gap-3 p-5 h-full max-h-[calc(100vh-3.5rem)] overflow-y-auto  pb-20">
      <div className="flex flex-col gap-2 p-5">
        <h2 className="text-zinc-800 text-xl lg:text-3xl md:text-2xl font-bold">
          Query Logs
        </h2>
        <span className="text-zinc-500 text-md lg:text-lg md:text-md font-semibold">
          View your Query Logs here
        </span>
      </div>
      <div className="flex flex-col gap-5">
        <QueriesTable />
      </div>
    </div>
  );
};

export default page;
