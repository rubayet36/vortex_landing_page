import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const plusJakartaSans = localFont({
  src: "./fonts/PlusJakartaSans-Latin.woff2",
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  weight: "400 800",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vortexfitnessclub.xyz"),
  title: {
    default: "Vortex Fitness Club | Banasree, Rampura",
    template: "%s | Vortex Fitness Club",
  },
  description:
    "Fitness club in Banasree, Rampura with strength training equipment, dedicated female zones, aerobics & Zumba classes, and sauna recovery.",
  applicationName: "Vortex Fitness Club",
  authors: [{ name: "Vortex Fitness Club" }],
  generator: "Next.js",
  keywords: [
    "Vortex Fitness Club",
    "Gym in Banasree",
    "Gym in Rampura",
    "Fitness Club Dhaka",
    "Ladies gym hours Banasree",
    "Gym with sauna Dhaka",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vortexfitnessclub.xyz",
    siteName: "Vortex Fitness Club",
    title: "Vortex Fitness Club | Banasree, Rampura",
    description:
      "Modern gym in Banasree, Rampura offering strength training, dedicated women's hours, aerobics & Zumba, and sauna recovery amenities.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vortex Fitness Club workout facilities and training floor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vortex Fitness Club | Banasree, Rampura",
    description:
      "Modern gym in Banasree, Rampura offering strength training, dedicated women's hours, aerobics & Zumba, and sauna recovery amenities.",
    images: ["/assets/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0D14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.className} antialiased selection:bg-red-500 selection:text-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
