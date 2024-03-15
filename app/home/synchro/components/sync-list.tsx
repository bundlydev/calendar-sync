"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ZGetSyncListSchema,
  type TGetSyncList,
} from "@/app/api/syncs/list/schemas";
import { PrivacyCalendarSyncTaskEnum } from "@prisma/client";

const SyncList = () => {
  const [syncList, setSyncList] = useState<TGetSyncList | never[]>([]);

  useEffect(() => {
    const fetchSyncs = async () => {
      const response = await fetch("/api/syncs/list");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const jsonRes = await response.json();
      const parsed = ZGetSyncListSchema.safeParse(jsonRes);
      if (!parsed.success) {
        return;
      }
      setSyncList(parsed.data);
    };
    void fetchSyncs();
  }, []);

  return (
    <>
      {syncList.map((sync) => (
        <div className="flex transform flex-row justify-around rounded-xl border bg-white p-4 shadow-sm transition-shadow duration-500 hover:shadow-lg dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7] md:p-5">
          <h3 className="self-center text-base font-bold text-gray-800 dark:text-white">
            <Image
              className="size-[32px] mx-2 inline-block rounded-full"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
              alt="Image Description"
              width={32}
              height={32}
            />
            {sync.sourceCredential?.calendars[0]?.name}
          </h3>
          <h3 className="self-center text-base font-bold text-gray-800 dark:text-white">
            <Image
              className="size-[32px] mx-2 inline-block rounded-full"
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
              alt="Image Description"
              width={32}
              height={32}
            />
            {sync.toCredential?.calendars[0]?.name}
          </h3>
          <div className="flex items-center">
            <label
              htmlFor="hs-basic-with-description"
              className="me-3 text-sm text-gray-500 dark:text-gray-400"
            >
              Off
            </label>
            <input
              type="checkbox"
              id="hs-basic-with-description"
              className="relative h-7 w-[3.25rem] cursor-pointer rounded-full border-transparent bg-gray-100 p-px text-transparent transition-colors duration-200 ease-in-out before:inline-block before:h-6 before:w-6 before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:ring-0 before:transition before:duration-200 before:ease-in-out checked:border-blue-600

checked:bg-none checked:text-blue-600 checked:before:translate-x-full checked:before:bg-blue-200 focus:ring-blue-600 focus:checked:border-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:before:bg-gray-400 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:checked:before:bg-blue-200 dark:focus:ring-offset-gray-600"
              checked={sync.enabled}
            />
            <label
              htmlFor="hs-basic-with-description"
              className="ms-3 text-sm text-gray-500 dark:text-gray-400"
            >
              On
            </label>
          </div>
          <p className="self-center text-base font-bold text-gray-800 dark:text-white">
            {PrivacyCalendarSyncTaskEnum[sync.privacy]}
          </p>
          <a
            className="inline-flex items-center gap-x-1 rounded-lg border border-transparent text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="#"
          >
            Edit
            <svg
              className="size-4 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
        </div>
      ))}
    </>
  );
};

export default SyncList;
