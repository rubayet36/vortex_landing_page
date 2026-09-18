import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VORTEX FITNESS CLUB — Stronger Move, Healthier Living",
  description: "Join a results-driven fitness community that empowers you to grow through shared goals, expert trainers, and premium amenities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-red-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
