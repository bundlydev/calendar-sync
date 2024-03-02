import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { SignIn, SignOut } from "@/components/auth-components";
import { RefreshCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default async function Page() {
  const session = await auth();
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Create <span className="text-purple-400">T3</span> App
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        <Link
          className="flex max-w-md flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
          href="https://create.t3.gg/en/usage/first-steps"
          target="_blank"
        >
          <h3 className="text-2xl font-bold">First Steps →</h3>
          <div className="text-md">Just the basics</div>
        </Link>
        <Link
          className="flex max-w-sm flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
          href="/synchronize"
        >
          <h3 className="relative flex items-center gap-2 text-2xl font-bold">
            <RefreshCcw />
            Synchronize
            <span className="absolute right-52 top-0 flex h-5 w-5 animate-bounce items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-700 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-500" />
            </span>
          </h3>
          <div className="text-md">
            Setup your calendars and start syncing them.
          </div>
        </Link>
      </div>
      <div className="flex flex-col items-center gap-2">
        {session?.user && <p className="text-2xl">Hello {session.user.name}</p>}
        {session?.user && <SignOut />}
        {!session?.user && <SignIn />}
      </div>
    </div>
  );
}
