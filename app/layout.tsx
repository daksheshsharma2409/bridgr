import type { Metadata } from "next";
import { Kalam, Patrick_Hand } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { ThreeBackground } from "@/components/ThreeBackground";
import { MockDataProvider } from "@/lib/MockDataContext";
import { BridgrThemeProvider } from "@/lib/ThemeContext";
import "./globals.css";

const kalam = Kalam({
    variable: "--font-kalam",
    weight: ["400", "700"],
    subsets: ["latin"],
});

const patrickHand = Patrick_Hand({
    variable: "--font-patrick-hand",
    weight: "400",
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
            data-theme="handdrawn"
            className={`${kalam.variable} ${patrickHand.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col font-sans bg-bg text-text overflow-x-hidden">
                <ThreeBackground />
                <BridgrThemeProvider>
                    <MockDataProvider>
                        <AppShell>{children}</AppShell>
                    </MockDataProvider>
                </BridgrThemeProvider>
            </body>
        </html>
    );
}
