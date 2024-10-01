import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LeadsFormGenerator from "@/components/forms/leads/leads-formGenrator";
import LeadsTable from "./leads-table";

const LeadsAndRecords = () => {
  return (
    <Tabs defaultValue="leads" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          value="leads"
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Leads
        </TabsTrigger>
        <TabsTrigger
          value="records"
          className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Records
        </TabsTrigger>
      </TabsList>
      <TabsContent value="leads">
        {/* Add your Leads content here */}
        <div className="p-4">
          <LeadsFormGenerator />
        </div>
      </TabsContent>
      <TabsContent value="records">
        {/* Add your Records content here */}
        <div className="p-4">
          <LeadsTable />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default LeadsAndRecords;
