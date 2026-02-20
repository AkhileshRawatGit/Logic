import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk"
});

export const metadata: Metadata = {
    title: "CyberQuiz | Future of Learning",
    description: "Experience the most advanced quiz platform in the galaxy.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
                <AuthProvider>
                    <SmoothScroll>
                        <div className="min-h-screen bg-[#0b0c10] text-white">
                            <Navbar />
                            <main>{children}</main>
                        </div>
                    </SmoothScroll>
                </AuthProvider>
            </body>
        </html>
    );
}
