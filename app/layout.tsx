import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// On charge la police Inter depuis Google Fonts.
// La variable CSS "--font-inter" est ensuite utilisée dans globals.css.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Academy",
  description: "Apprends à créer de vraies applications avec Claude Code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
