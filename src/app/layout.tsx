import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
import "./globals.css";


export const metadata: Metadata = {
  title: 'Quick, Pick!',
  description: 'A simple tool to help you with FRC alliance selection using data from Statbotics.',
  metadataBase: new URL('https://quick-pick-psi.vercel.app/'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.jpg" sizes="any" />
      </head>
      <body
        className={`${inter.className} antialiased dark bg-[#0d111b]`}
      >
        {children}
      </body>
    </html>
  );
}
