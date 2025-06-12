import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { NavBar } from "@/components/nav-bar";
import { AuthProvider } from "@/components/auth-provider";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "EventEase",
  description:
    "A scalable and intuitive event management solution for efficient event planning and participant engagement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background flex flex-col">
        <AuthProvider>
          <Suspense fallback={<div className="h-16 border-b" />}>
            <NavBar />
          </Suspense>
          <main className="container mx-auto py-6 flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
