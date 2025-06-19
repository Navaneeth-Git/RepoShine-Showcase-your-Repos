import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "RepoShine - Showcase Your GitHub Repositories",
  description: "Create beautiful, personalized showcases of your GitHub repositories with glassmorphism design and smooth animations.",
  keywords: ["GitHub", "repositories", "showcase", "portfolio", "developer"],
  authors: [{ name: "RepoShine" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${poppins.className} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
