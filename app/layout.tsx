import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from "next/link";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your habits and goals with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            {/* <SignedOut>
              <SignInButton/>
            </SignedOut> */}
            <SignedIn>
            <div className="flex justify-end items-center py-4 px-8 w-full font-serif">
              <div className="mr-4">
                <Link href="/Account" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-slate-500">
                  Account
                </Link>
              </div>
              <UserButton />
            </div>

            </SignedIn>
          </header>
          <main className="font-serif">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
