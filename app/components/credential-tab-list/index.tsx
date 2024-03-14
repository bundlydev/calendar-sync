import { Suspense } from "react";

import { AddCalendar } from "./components/add-calendar";
import CalendarsTabList from "./components/calendar-credential-list";

const CredentialTabList = () => {
  return (
    <nav className="flex space-x-2" aria-label="Tabs" role="tablist">
      <button
        type="button"
        className="active inline-flex items-center gap-x-2 rounded-lg bg-transparent px-4 py-3 text-center text-sm font-medium text-gray-500 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50 hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 hs-tab-active:dark:text-white"
        id="pills-with-brand-color-item-0"
        data-hs-tab="#pills-with-brand-color-0"
        aria-controls="pills-with-brand-color-0"
        role="tab"
      >
        All
      </button>
      <Suspense
        fallback={
          <div className="">
            <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        }
      >
        <CalendarsTabList />
      </Suspense>
      <button
        type="button"
        className="inline-flex items-center gap-x-2 rounded-lg bg-transparent px-4 py-3 text-center text-sm font-medium text-gray-500 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50 hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 hs-tab-active:dark:text-white"
        id="pills-with-brand-color-item-3"
        role="tab"
      >
        <AddCalendar />
      </button>
    </nav>
  );
};

export default CredentialTabList;
