import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Chrome from "@/components/Chrome";

const geist = Inter({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Halo — your personal brand OS",
  description: "Hi, I'm Halo. I run the boring half of your creator life.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="bubblegum" className={`${geist.variable} ${geistMono.variable} ${serif.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <Chrome>{children}</Chrome>
        </Providers>
      </body>
    </html>
  );
}
