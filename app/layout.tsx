import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, DM_Serif_Display } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { MockDataProvider } from "@/lib/MockDataContext";
import { BridgrThemeProvider } from "@/lib/ThemeContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bridgr — The Campus Skill-Signal",
  description: "Bridge the gap. Find your nerd. Earn your karma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="midnight"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-bg text-text">
        <BridgrThemeProvider>
          <MockDataProvider>
            <AppShell>{children}</AppShell>
          </MockDataProvider>
        </BridgrThemeProvider>
      </body>
    </html>
  );
}
