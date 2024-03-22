import Image from "next/image";
import { auth } from "@/auth";

const Header = async () => {
  const session = await auth();
  <div className="flex flex-row items-end justify-end py-2">
    <button
      type="button"
      className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
    >
      <Image
        className="size-8 inline-block rounded-full"
        src={session?.user?.image || "https://placehold.it/30x30"}
        alt={session?.user?.name || "User Image"}
        width={20}
        height={20}
      />
      {session ? session.user?.name : ""}
    </button>
  </div>;
};

export default Header;
