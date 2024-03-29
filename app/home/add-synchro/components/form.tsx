"use client";

import { useEffect, useState } from "react";
import {
  ZGetCalendarListSchema,
  type TGetCalendarList,
} from "@/app/api/apps/calendar/list/schemas";
import { AddCalendar } from "@/app/components/credential-tab-list/components/add-calendar";
import {
  AllDayEventConfigEnum,
  PrivacyCalendarSyncTaskEnum,
} from "@prisma/client";
import { useFormState } from "react-dom";

import { createSyncTask } from "./action";
import { SubmitButton } from "./submit-button";

const initialState = {
  message: "",
};

const Form = () => {
  const [state, formAction] = useFormState(createSyncTask, initialState);

  const [calendarList, setCalendarList] = useState<TGetCalendarList | never[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendars = async () => {
      const response = await fetch("/api/apps/calendar/list");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const jsonRes = await response.json();
      const parsed = ZGetCalendarListSchema.safeParse(jsonRes);
      if (!parsed.success) {
        return;
      }
      setCalendarList(parsed.data);
      setLoading(false);
    };
    void fetchCalendars();
  }, []);

  return (
    <form className="m-auto mt-8" action={formAction}>
      <div>
        {/* Card */}
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-transparent dark:text-gray-400 md:p-5">
          {/* This has to be split in 2 selects */}
          <div className="flex flex-row">
            <div className="flex-1 px-4">
              <h2 className="text-base font-bold dark:text-gray-100">From</h2>
              <p className="text-sm text-gray-500 dark:text-gray-200">
                Calendar you want to sync from
              </p>

              <select
                id="sourceCredentialId"
                name="sourceCredentialId"
                defaultValue={state?.select?.sourceCredentialId}
                // {...register("sourceCredentialId")}
                className="mt-4 w-full rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-slate-900"
                // onChange={(e) => {
                // setValue("sourceCredentialId", e.target.value);
                // }}
                disabled={loading}
              >
                <option value="">
                  {loading ? "Loading..." : "Select a calendar"}
                </option>
                {calendarList.map((calendar) => (
                  <option key={calendar.id} value={calendar.id}>
                    {calendar?.calendars[0]?.name ?? ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 px-4">
              <h2 className="text-base font-bold dark:text-gray-100">To</h2>
              <p className="text-sm text-gray-500 dark:text-gray-200">
                Calendar you want to sync to
              </p>
              <select
                id="toCredentialId"
                name="toCredentialId"
                // {...register("toCredentialId")}
                className="mt-4 w-full rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-slate-900"
                // onChange={(e) => {
                // setValue("toCredentialId", e.target.value);
                // }}
                disabled={loading}
              >
                {/* Default option */}
                <option value="">
                  {loading ? "Loading..." : "Select a calendar"}
                </option>
                {/* Calendar list */}
                {calendarList
                  // .filter((item) => {
                  //   return item.id !== watch("sourceCredentialId");
                  // })
                  .map((calendar) => (
                    <option key={calendar.id} value={calendar.id}>
                      {calendar?.calendars[0]?.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-row justify-end px-4">
            <p className="mr-2 text-base underline">
              Want to add another calendar?
            </p>
            <AddCalendar />
          </div>
        </div>
      </div>

      <div className="mt-4">
        {/* What color */}
        <h2 className="text-base font-bold">Colors and style</h2>
        <p className="text-sm text-gray-500 dark:text-gray-200">
          Pick a color and style to represent this sync in your calendar.
        </p>

        <input
          id="color"
          name="color"
          type="color"
          className="mt-4 block h-10 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900"
          title="Choose your color"
        />
      </div>
      {/* Privacy/Visibility */}
      <div className="mt-4">
        <h2 className="text-base font-bold">Privacy settings</h2>
        <p className="text-sm text-gray-200">
          Choose a privacy that adjust your needs
        </p>
        <div className="mt-4 grid space-y-3">
          <div className="relative flex items-start">
            <div className="mt-1 flex h-5 items-center">
              <input
                id="privacy"
                name="privacy"
                type="radio"
                className="rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                aria-describedby="hs-radio-delete-description"
                value={PrivacyCalendarSyncTaskEnum.Personal}
              />
            </div>
            <label htmlFor="hs-radio-delete" className="ms-3">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-300">
                Personal Commitment for all
              </span>
              <span
                id="hs-radio-delete-description"
                className="block text-sm text-gray-600 dark:text-gray-500"
              >
                Personal Commitment
              </span>
            </label>
          </div>

          <div className="relative flex items-start">
            <div className="mt-1 flex h-5 items-center">
              <input
                id="privacy"
                name="privacy"
                type="radio"
                className="rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                aria-describedby="hs-radio-archive-description"
                value={PrivacyCalendarSyncTaskEnum.Busy}
              />
            </div>
            <label htmlFor="hs-radio-archive" className="ms-3">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-300">
                Busy for all
              </span>
              <span
                id="hs-radio-archive-description"
                className="block text-sm text-gray-600 dark:text-gray-500"
              >
                Notify me when this action happens.
              </span>
            </label>
          </div>

          <div className="relative flex items-start">
            <div className="mt-1 flex h-5 items-center">
              <input
                id="privacy"
                name="privacy"
                type="radio"
                className="rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                aria-describedby="hs-radio-archive-description"
                value={PrivacyCalendarSyncTaskEnum.Partial}
              />
            </div>
            <label htmlFor="hs-radio-archive" className="ms-3">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-300">
                Details for you, busy to others
              </span>
              <span
                id="hs-radio-archive-description"
                className="block text-sm text-gray-600 dark:text-gray-500"
              >
                Notify me when this action happens.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* All day events */}
      <div>
        <h2 className="mt-8 text-base font-bold">All day events</h2>
        <p className="text-sm text-gray-500 dark:text-gray-200">
          Choose how you want to handle all day events
        </p>
        {/* Dont sync */}
        {/* Sync only all day events that are busy */}
        {/* Sync all */}
        <div className="mt-4 grid space-y-3">
          <div className="relative flex items-start">
            <div className="mt-1 flex h-5 items-center">
              <input
                id="allDayEventConfig"
                name="allDayEventConfig"
                type="radio"
                className="rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                aria-describedby="hs-radio-delete-description"
                value={AllDayEventConfigEnum.NoAllDay}
              />
            </div>
            <label htmlFor="hs-radio-delete" className="ms-3">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-300">
                Don't sync
              </span>
              <span
                id="hs-radio-delete-description"
                className="block text-sm text-gray-600 dark:text-gray-500"
              >
                Personal Commitment
              </span>
            </label>
          </div>

          <div className="relative flex items-start">
            <div className="mt-1 flex h-5 items-center">
              <input
                id="allDayEventConfig"
                name="allDayEventConfig"
                type="radio"
                className="rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                aria-describedby="hs-radio-archive-description"
                value={AllDayEventConfigEnum.Busy}
              />
            </div>
            <label htmlFor="hs-radio-archive" className="ms-3">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-300">
                Sync only all day events that are busy
              </span>
              <span
                id="hs-radio-archive-description"
                className="block text-sm text-gray-600 dark:text-gray-500"
              >
                Notify me when this action happens.
              </span>
            </label>
          </div>

          <div className="relative flex items-start">
            <div className="mt-1 flex h-5 items-center">
              <input
                id="allDayEventConfig"
                name="allDayEventConfig"
                type="radio"
                className="-blue-500 rounded-full border-gray-200 text-blue-600
                    focus:ring dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                aria-describedby="hs-radio-archive-description"
                value={AllDayEventConfigEnum.All}
              />
            </div>
            <label htmlFor="hs-radio-archive" className="ms-3">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-300">
                Sync all
              </span>
              <span
                id="hs-radio-archive-description"
                className="block text-sm text-gray-600 dark:text-gray-500"
              >
                Notify me when this action happens.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Save option */}
      <div className="mt-8 flex justify-end">
        <SubmitButton />
      </div>

      {/* Delete option as danger */}

      {/* <div className="mt-8">
        <h2 className="text-base font-bold">Danger Zone</h2>
        <p className="text-sm text-gray-500">
          This action is irreversible, be careful
        </p>

        <button
          type="button"
          className="mt-2 inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          Delete Sync
        </button>
      </div> */}
    </form>
  );
};
export default Form;
