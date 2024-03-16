import React, { Suspense } from "react";
import Link from "next/link";
import CredentialTabList from "@/app/components/credential-tab-list";
import Header from "@/app/components/header";
import { PlusIcon } from "lucide-react";

import SyncList from "./components/sync-list";

const CalendarSyncPage: React.FC = () => {
  return (
    <div className="container px-8 pt-2">
      {/* Nav Username Button */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Async react component */}
        <Header />
      </Suspense>
      {/* Add Sync Button */}
      <div className="flex flex-row items-end justify-end py-2">
        <Link href="/home/add-synchro">
          <button
            type="button"
            className="inline-flex transform items-center gap-x-2 rounded-lg border border-transparent bg-gray-800 px-2 py-2 text-sm font-semibold text-white ease-out hover:scale-105 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-200 dark:text-black dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            <PlusIcon
              width={20}
              height={20}
              fill="white"
              className="dark:text-black"
            />{" "}
            Add sync
          </button>
        </Link>
      </div>

      <div>
        <CredentialTabList />
      </div>

      {/* "Sync Table" headers */}
      <SyncList />
    </div>
  );
};

export default CalendarSyncPage;
