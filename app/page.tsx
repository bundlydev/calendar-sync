import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { HomeLogin } from "@/components/auth-components";
import { LucideSwords, Search, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default async function Page() {
  const session = await auth();
  return (
    <div className="container mx-auto">
      <header className="flex w-full flex-wrap bg-white py-4 text-sm dark:bg-gray-800 sm:flex-nowrap sm:justify-start">
        <nav
          className="mx-auto flex w-full max-w-[85rem] basis-full flex-wrap items-center justify-between px-4"
          aria-label="Global"
        >
          <a
            className="flex-none text-xl font-semibold dark:text-white sm:order-1"
            href="#"
          >
            <Image
              src="/logo-sync.svg"
              alt="CalendSync"
              width={210}
              height={30}
              className="dark:invert"
            />
          </a>
          <div className="flex items-center gap-x-2 sm:order-3">
            <button
              type="button"
              className="hs-collapse-toggle inline-flex items-center justify-center gap-x-2 rounded-lg border border-gray-200 bg-white p-2.5 text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 sm:hidden"
              data-hs-collapse="#navbar-alignment"
              aria-controls="navbar-alignment"
              aria-label="Toggle navigation"
            >
              <svg
                className="size-4 flex-shrink-0 hs-collapse-open:hidden"
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
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <svg
                className="size-4 hidden flex-shrink-0 hs-collapse-open:block"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            <Search width={20} height={20} opacity={0.5} className="mx-4" />
            {session?.user && (
              <Link href="/home">
                <button className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                  <User width={15} height={15} />
                  Hello {session.user.name}
                </button>
              </Link>
            )}
            {!session?.user && <HomeLogin />}
          </div>
          <div
            id="navbar-alignment"
            className="hs-collapse hidden grow basis-full overflow-hidden transition-all duration-300 sm:order-2 sm:block sm:grow-0 sm:basis-auto"
          >
            <div className="mt-5 flex flex-col gap-5 sm:mt-0 sm:flex-row sm:items-center sm:ps-5">
              <a
                className="font-medium text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                href="#"
                aria-current="page"
              >
                Landing
              </a>
              <a
                className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                href="#"
              >
                Account
              </a>
              <a
                className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                href="#"
              >
                Work
              </a>
              <a
                className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                href="#"
              >
                Blog
              </a>
              <a
                className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                href="#"
              >
                Docs
                <span className="font-base mx-1 inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
                  New
                </span>
              </a>
            </div>
          </div>
        </nav>
      </header>
      <section className="mt-8 flex flex-col">
        {/* 2 sections half and half*/}
        <div className="flex flex-row justify-between">
          <div className="flex flex-1 flex-col items-start justify-center">
            <h1 className="text-left text-6xl font-bold text-gray-800">
              Finally fix your calendar <br /> game
            </h1>
            <p className="mt-4 text-left text-xl font-light text-gray-600">
              Calendars that talk with each other, so you can <br /> focus on
              what really matters.
            </p>
            <div className="mt-8 flex flex-row items-center justify-center">
              <p className="mr-6 text-base font-bold">COMPATIBLE WITH:</p>
              {/* GCALENDAR LOGO with text */}
              <div className="mx-2 flex flex-row items-center justify-center">
                <Image
                  src="/gcal.png"
                  alt="Google Calendar"
                  width={24}
                  height={24}
                />
                <p className="mx-4 text-base font-semibold">Gmail</p>
              </div>
              <div className="mx-2 flex flex-row items-center justify-center">
                {/* OUTLOOK LOGO with text */}
                <Image src="/notion.png" alt="Notion" width={24} height={24} />
                <p className="mx-4 text-base font-semibold">Notion</p>
              </div>
              <div className="mx-2 flex flex-row items-center justify-center">
                {/* APPLE LOGO with text */}
                <Image src="/apple.png" alt="Apple" width={24} height={24} />
                <p className="mx-4 text-base font-semibold">Apple</p>
              </div>
            </div>
            <div className="mt-10">
              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-gray-800 px-8 py-3.5 text-sm font-semibold text-white hover:bg-gray-900 disabled:pointer-events-none disabled:opacity-50 dark:bg-white dark:text-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                Get Started
              </button>
              <button
                type="button"
                className="ml-6 inline-flex items-center gap-x-2 rounded-lg border border-gray-800 px-12 py-3.5 text-sm font-semibold text-gray-800 hover:border-gray-500 hover:text-gray-500 disabled:pointer-events-none disabled:opacity-50 dark:border-white dark:text-white dark:hover:border-gray-300 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                Playground
              </button>
            </div>
          </div>

          <div className="flex-1">
            <Image
              src="/calendar.jpeg"
              alt="Calendar"
              width={624}
              height={640}
              className="rounded-3xl shadow-md shadow-black"
            />
          </div>
        </div>
      </section>
      <section className="mt-8 flex flex-col items-center justify-center">
        <div className="mt-8 flex flex-row justify-between">
          <div className="mr-2 flex flex-1 flex-row items-center justify-center">
            <LucideSwords size={32} className="mr-4 self-start" />
            <div className="flex flex-col pr-8">
              <p className="text-sm font-bold text-gray-800 dark:text-white">
                Connect your calendars
              </p>
              <p className="text-sm font-light text-gray-600 dark:text-gray-300">
                Connect your calendars from Google, Apple, Outlook, and Notion
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-row items-center justify-center ">
            <LucideSwords size={32} className="mr-4 self-start" />
            <div className="flex flex-col pr-8">
              <p className="text-sm font-bold text-gray-800 dark:text-white">
                Sync your events
              </p>
              <p className="text-sm font-light text-gray-600 dark:text-gray-300">
                Connect your calendars from Google, Apple, Outlook, and Notion
              </p>
            </div>
          </div>
          <div className="ml-2 flex flex-1 flex-row items-center justify-center">
            <LucideSwords size={32} className="mr-4 self-start" />
            <div className="flex flex-col pr-8">
              <p className="text-sm font-bold text-gray-800 dark:text-white">
                Enjoy your life
              </p>
              <p className="text-sm font-light text-gray-600 dark:text-gray-300">
                Connect your calendars from Google, Apple, Outlook, and Notion
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
