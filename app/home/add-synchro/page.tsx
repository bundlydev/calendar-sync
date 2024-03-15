import { Suspense } from "react";
import Header from "@/app/components/header";

// import CalendarList from "./components/calendar-list";
import Form from "./components/form";

const AddSynchroPage = () => {
  return (
    <div className="container px-8">
      {/* @TODO: not currently working */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Async react component */}
        <Header />
      </Suspense>
      <div className="mt-8">
        <h1 className="text-lg font-bold">Add Synchro Details</h1>
        <Form />
      </div>
    </div>
  );
};

export default AddSynchroPage;
