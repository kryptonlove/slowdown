import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Script from 'next/script' // imported for analytic


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Slow Down — Relaxing Arcade Game",
  description: "Touch the screen to slow down. Catch stars, avoid enemies, earn Shmiggle coins.",
  openGraph: {
    title: "Slow Down — Relaxing Arcade Game",
    description: "Touch the screen to slow down. Catch stars, avoid enemies, earn Shmiggle coins.",
    url: "https://slowdown.diggle.fun",
    images: [
      {
        url: "https://slowdown.diggle.fun/preview.png",
        width: 1200,
        height: 630,
        alt: "Slow Down Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Slow Down — Relaxing Arcade Game",
    description: "Touch the screen to slow down. Catch stars, avoid enemies, earn Shmiggle coins.",
    images: ["https://slowdown.diggle.fun/assets/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          defer
          data-domain="slowdown.diggle.fun"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body className={inter.className}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  );
}
