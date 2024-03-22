"use client";

// @ts-expect-error new hook
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending }: { pending: boolean } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex items-center gap-x-2 self-end rounded-lg border border-transparent bg-gray-800 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:pointer-events-none disabled:opacity-50 dark:bg-white dark:text-gray-800 hover:dark:bg-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      aria-disabled={pending}
    >
      Save
    </button>
  );
}
