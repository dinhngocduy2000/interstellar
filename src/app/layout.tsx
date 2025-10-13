import type { Metadata } from "next";
import "../assets/style/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import ReactQueryProviders from "@/components/providers/react-query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ToastProvider from "@/components/providers/toast.provider";
import { DefaultMetadata } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = DefaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="mR4qYmtt6qpoWPEbihH5MBmLrmkuuUpYfsSH7gcXKE0"
        />
        <meta
          name="description"
          content="Interstellar is a modern AI chatbot that can help you with your tasks and projects"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <main className="flex h-screen w-screen items-center justify-center bg-muted">
          <ReactQueryProviders>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ToastProvider>{children}</ToastProvider>
            </ThemeProvider>
          </ReactQueryProviders>
        </main>
      </body>
    </html>
  );
}
