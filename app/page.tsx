import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { HomeLogin } from "@/components/auth-components";
import { LucideSwords, Menu, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default async function Page() {
  const session = await auth();
  return (
    <div className="container mx-auto md:max-w-7xl">
      <header className="flex w-full flex-wrap bg-white px-2 py-4 text-sm dark:bg-transparent sm:flex-nowrap sm:justify-start">
        <nav
          className="mx-auto flex w-full basis-full flex-wrap items-center justify-between"
          aria-label="Global"
        >
          <a
            className="flex-none text-xl font-semibold dark:text-gray-200 sm:order-1"
            href="#"
          >
            <Image
              src="/logo-sync.svg"
              alt="CalendSync"
              width={210}
              height={30}
              className="dark:brightness-100 dark:contrast-100 dark:grayscale dark:invert dark:filter"
            />
          </a>
          <div className="flex items-center gap-x-2 sm:order-3">
            <button
              type="button"
              className="hs-collapse-toggle inline-flex items-center justify-center gap-x-2 rounded-lg border border-gray-200 bg-white p-2.5 text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-200  dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 sm:hidden"
              data-hs-collapse="#navbar-alignment"
              aria-controls="navbar-alignment"
              aria-label="Toggle navigation"
            >
              <Menu width={24} height={24} />
            </button>
            {/* <Search
              width={20}
              height={20}
              opacity={0.5}
              className="mx-4 dark:invert"
            /> */}
            {session?.user && (
              <Link href="/home/synchro" className="hidden sm:inline-block">
                <button className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition ease-out hover:scale-105 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
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
            <div className="mt-5 flex flex-col gap-5 sm:mt-0 sm:flex-row sm:items-center sm:justify-center sm:gap-0 sm:ps-5">
              <a
                className="font-medium text-blue-500 dark:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                href="/"
                aria-current="page"
              >
                Landing
              </a>
              {/* <a
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
              </a> */}
            </div>
            {session?.user && (
              <Link href="/home/synchro" className="sm:hidden">
                <button className="inline-flex items-center gap-x-2 rounded-lg py-2 text-sm font-medium text-gray-800 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                  Hello {session.user.name}
                  <User width={15} height={15} />
                </button>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <section className="mt-8 flex flex-col px-4">
        {/* 2 sections half and half*/}
        <div className="flex flex-row justify-between">
          <div className="flex flex-1 flex-col items-start justify-center">
            <h1 className="text-left text-4xl font-bold text-gray-800 dark:text-gray-200 sm:text-6xl">
              Finally fix your calendar <br /> game
            </h1>
            <p className="text-balance mt-4 max-w-[100vw] text-left text-lg font-light text-gray-600 dark:text-gray-400 sm:text-xl md:max-w-lg">
              Calendars that talk with each other, so you can focus on what
              really matters.
            </p>

            <div className="mt-8 flex flex-col space-y-4 self-start md:flex-row md:items-center md:justify-center md:space-y-0">
              <p className="mr-2 text-base font-bold dark:text-gray-200 lg:mr-6">
                COMPATIBLE WITH:
              </p>
              {/* GCALENDAR LOGO with text */}
              <div className="mx-2 flex flex-row items-center justify-center">
                <Image
                  src="/gcal.png"
                  alt="Google Calendar"
                  width={24}
                  height={24}
                />
                <p className="mx-2 text-base font-semibold dark:text-gray-200 lg:mx-4">
                  Gmail
                </p>
              </div>
              <div className="mx-2 flex flex-row items-center justify-center">
                {/* OUTLOOK LOGO with text */}
                <Image
                  src="/notion.png"
                  alt="Notion"
                  width={24}
                  height={24}
                  className="dark:invert"
                />
                <p className="mx-2 text-base font-semibold dark:text-gray-200 lg:mx-4">
                  Notion
                </p>
              </div>
              <div className="mx-2 flex flex-row items-center justify-center">
                {/* APPLE LOGO with text */}
                <Image
                  src="/apple.png"
                  alt="Apple"
                  width={24}
                  height={24}
                  className="dark:invert"
                />
                <p className="mx-2 text-base font-semibold dark:text-gray-200 lg:mx-4">
                  Apple
                </p>
              </div>
            </div>

            <div className="mt-10 flex w-full flex-col space-y-4 sm:w-auto sm:flex-row sm:space-y-0">
              <button
                type="button"
                className="inline-flex h-auto min-w-[150px] items-center justify-center rounded-lg border border-transparent bg-gray-800 px-4 py-3.5 text-sm font-semibold text-white transition ease-out hover:scale-105 disabled:pointer-events-none disabled:opacity-50 dark:border-white dark:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                Get Started
              </button>
              {/* <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-gray-800 px-12 py-3.5 text-sm font-semibold text-gray-800 transition ease-out hover:scale-105 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:border-gray-300 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 sm:ml-6"
              >
                Playground
              </button> */}
            </div>
          </div>

          <div className="hidden flex-1 sm:inline-block">
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
      <section className="mt-12 hidden flex-col items-center px-4 md:flex">
        <div className="mt-8 flex flex-row justify-around">
          <div className="mr-2 flex flex-1 flex-row items-center justify-center">
            <LucideSwords size={32} className="mr-4 self-start dark:invert" />
            <div className="flex flex-col pr-8">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                Connect your calendars
              </p>
              <p className="max-w-xs text-sm font-light text-gray-600 dark:text-gray-300">
                Connect your calendars from Google, Apple, Outlook, and Notion
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-row items-center justify-center">
            <LucideSwords size={32} className="mr-4 self-start dark:invert" />
            <div className="flex flex-col pr-8">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                Sync your events
              </p>
              <p className="max-w-xs text-sm font-light text-gray-600 dark:text-gray-300">
                Connect your calendars from Google, Apple, Outlook, and Notion
              </p>
            </div>
          </div>
          <div className="ml-2 flex flex-1 flex-row items-center justify-center">
            <LucideSwords size={32} className="mr-4 self-start dark:invert" />
            <div className="flex flex-col pr-8">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                Enjoy your life
              </p>
              <p className="max-w-xs text-sm font-light text-gray-600 dark:text-gray-300">
                Connect your calendars from Google, Apple, Outlook, and Notion
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
