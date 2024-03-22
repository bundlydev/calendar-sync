import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex">
      <section className="hidden w-64 flex-col lg:inline-block">
        {/* <!-- Navigation Toggle --> */}
        {/* <button
          type="button"
          className="text-gray-500 hover:text-gray-600"
          data-hs-overlay="#docs-sidebar"
          aria-controls="docs-sidebar"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle Navigation</span>
          <svg
            className="size-4 flex-shrink-0"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </button> */}
        {/* <!-- End Navigation Toggle --> */}

        <div
          id="docs-sidebar"
          className="hs-overlay fixed bottom-0 start-0 top-0 z-[60] hidden w-64 -translate-x-full transform overflow-y-auto border-e border-gray-200 bg-white pb-10 pt-7 transition-all duration-300 hs-overlay-open:translate-x-0 dark:border-gray-700 dark:bg-transparent lg:bottom-0 lg:end-auto lg:block lg:translate-x-0 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-slate-700 [&::-webkit-scrollbar]:w-2"
        >
          <div className="px-6">
            <a
              className="flex-none text-xl font-semibold dark:text-white"
              href="#"
              aria-label="Brand"
            >
              <Image
                src="/logo-sync.svg"
                alt="Logo"
                width={180}
                height={70}
                className="dark:brightness-100 dark:contrast-100 dark:grayscale dark:invert dark:filter"
                priority
              />
            </a>
          </div>
          <nav
            className="hs-accordion-group flex w-full flex-col flex-wrap p-6"
            data-hs-accordion-always-open
          >
            <ul className="space-y-1.5">
              <li className="hs-accordion" id="home-accordion">
                <Link href="/home/synchro">
                  <button
                    type="button"
                    className="hs-accordion-toggle dark:bg-transparenttext-gray-500 flex w-full items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-start text-sm text-slate-700 hover:bg-gray-100 hover:text-gray-600 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent dark:text-slate-400 dark:hover:bg-gray-900 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:hs-accordion-active:text-white"
                  >
                    <Home width={24} height={24} />
                    Home
                    <svg
                      className="size-4 ms-auto hidden text-gray-600 group-hover:text-gray-500 hs-accordion-active:block dark:text-gray-400"
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
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                    <svg
                      className="size-4 ms-auto block text-gray-600 group-hover:text-gray-500 hs-accordion-active:hidden dark:text-gray-400"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                  </button>
                </Link>
                <div
                  id="home-accordion"
                  className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
                >
                  <ul
                    className="hs-accordion-group ps-3 pt-2"
                    data-hs-accordion-always-open
                  >
                    <li className="hs-accordion" id="home-accordion-sub-1">
                      <Link href="/home/synchro">
                        <button
                          type="button"
                          className="hs-accordion-toggle dark:bg-transparenttext-gray-500 flex w-full items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-start text-sm text-slate-700 hover:bg-gray-100 hover:text-gray-600 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent dark:text-slate-400 dark:hover:bg-gray-900 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:hs-accordion-active:text-white"
                        >
                          Synchro
                        </button>
                      </Link>
                    </li>
                    <li className="hs-accordion" id="home-accordion-sub-2">
                      <Link href="/home/xyz">
                        <button
                          type="button"
                          className="hs-accordion-toggle dark:bg-transparenttext-gray-500 flex w-full items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-start text-sm text-slate-700 hover:bg-gray-100 hover:text-gray-600 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent dark:text-slate-400 dark:hover:bg-gray-900 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:hs-accordion-active:text-white"
                        >
                          XYZ
                        </button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="hs-accordion" id="account-accordion">
                <button
                  type="button"
                  className="hs-accordion-toggle dark:bg-transparenttext-gray-500 flex w-full items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-start text-sm text-slate-700 hover:bg-gray-100 hover:text-gray-600 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent dark:text-slate-400 dark:hover:bg-gray-900 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:hs-accordion-active:text-white"
                >
                  <svg
                    className="size-4"
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
                    <circle cx="18" cy="15" r="3" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M10 15H6a4 4 0 0 0-4 4v2" />
                    <path d="m21.7 16.4-.9-.3" />
                    <path d="m15.2 13.9-.9-.3" />
                    <path d="m16.6 18.7.3-.9" />
                    <path d="m19.1 12.2.3-.9" />
                    <path d="m19.6 18.7-.4-1" />
                    <path d="m16.8 12.3-.4-1" />
                    <path d="m14.3 16.6 1-.4" />
                    <path d="m20.7 13.8 1-.4" />
                  </svg>
                  Account
                  <svg
                    className="size-4 ms-auto hidden text-gray-600 group-hover:text-gray-500 hs-accordion-active:block dark:text-gray-400"
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
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                  <svg
                    className="size-4 ms-auto block text-gray-600 group-hover:text-gray-500 hs-accordion-active:hidden dark:text-gray-400"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </button>

                <div
                  id="account-accordion"
                  className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
                >
                  <ul className="ps-2 pt-2">
                    <li>
                      <a
                        className="dark:bg-transparenttext-gray-500 flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        href="#"
                      >
                        Link 1
                      </a>
                    </li>
                    <li>
                      <a
                        className="dark:bg-transparenttext-gray-500 flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        href="#"
                      >
                        Link 2
                      </a>
                    </li>
                    <li>
                      <a
                        className="dark:bg-transparenttext-gray-500 flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        href="#"
                      >
                        Link 3
                      </a>
                    </li>
                  </ul>
                </div>
              </li>

              {/* <li className="hs-accordion" id="projects-accordion">
                <button
                  type="button"
                  className="hs-accordion-toggle dark:bg-transparenttext-gray-500 flex w-full items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-start text-sm text-slate-700 hover:bg-gray-100 hover:text-gray-600 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent dark:text-slate-400 dark:hover:bg-gray-900 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:hs-accordion-active:text-white"
                >
                  <svg
                    className="size-4"
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
                    <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
                    <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
                    <path d="M15 2v5h5" />
                  </svg>
                  Projects
                  <svg
                    className="size-4 ms-auto hidden text-gray-600 group-hover:text-gray-500 hs-accordion-active:block dark:text-gray-400"
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
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                  <svg
                    className="size-4 ms-auto block text-gray-600 group-hover:text-gray-500 hs-accordion-active:hidden dark:text-gray-400"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                </button>

                <div
                  id="projects-accordion"
                  className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
                >
                  <ul className="ps-2 pt-2">
                    <li>
                      <a
                        className="dark:bg-transparenttext-gray-500 flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        href="#"
                      >
                        Link 1
                      </a>
                    </li>
                    <li>
                      <a
                        className="dark:bg-transparenttext-gray-500 flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        href="#"
                      >
                        Link 2
                      </a>
                    </li>
                    <li>
                      <a
                        className="dark:bg-transparenttext-gray-500 flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        href="#"
                      >
                        Link 3
                      </a>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <a
                  className="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-gray-900 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  href="#"
                >
                  <svg
                    className="size-4"
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
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                    <path d="M8 14h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 14h.01" />
                    <path d="M8 18h.01" />
                    <path d="M12 18h.01" />
                    <path d="M16 18h.01" />
                  </svg>
                  Calendar
                </a>
              </li>

              <li>
                <a
                  className="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-gray-900 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  href="#"
                >
                  <svg
                    className="size-4"
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
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  Documentation
                </a>
              </li> */}
            </ul>
          </nav>
        </div>
      </section>
      <section className="flex flex-1 flex-col items-center lg:px-8">
        <div className="w-full max-w-screen-lg">{children}</div>
      </section>
    </section>
  );
}
