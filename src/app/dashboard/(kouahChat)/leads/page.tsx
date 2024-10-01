import LeadsAndRecords from "@/components/dashboard/leads";

const Leads = () => {
  return (
    <div className="flex flex-col gap-3 p-5 h-full max-h-[calc(100vh-3.5rem)] overflow-y-auto  pb-20">
      <div className="flex flex-col gap-2 p-5">
        <h2 className="text-zinc-800 text-xl lg:text-3xl md:text-2xl font-bold">
          Leads
        </h2>
        <span className="text-zinc-500 text-md lg:text-lg md:text-md font-semibold">
          View your leads here
        </span>
      </div>
      <div className="flex flex-col gap-5">
        <LeadsAndRecords />
      </div>
    </div>
  );
};

export default Leads;
