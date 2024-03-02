import { type Session } from "next-auth";

import "../globals.css";
import { Inter } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <html lang="en" data-theme="dark" className={inter.className}>
      <head />

      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[rgb(46,2,109)] to-slate-900">
          {children}
        </main>
      </body>
    </html>
  );
}
