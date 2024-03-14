import { type Session } from "next-auth";

import "../globals.css";
import { Inter } from "next/font/google";

import PrelineScript from "./components/preline-script";

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

      <body className="">
        <main className="">{children}</main>
      </body>

      <PrelineScript />
    </html>
  );
}
