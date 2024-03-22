import { Suspense } from "react";
import Header from "@/app/components/header";

import { Calendar } from "./components/calendar";

export default function Page() {
  return (
    <div className="container h-screen px-8">
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Async react component */}
        <Header />
      </Suspense>
      <div className="mt-4">
        {/* @TODO: events missing date from backend? */}
        <Calendar />
      </div>
    </div>
  );
}
