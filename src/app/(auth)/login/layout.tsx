import type { Metadata } from "next";
import "@/assets/style/globals.css";
import { DefaultMetadata } from "@/lib/utils";

export const metadata: Metadata = DefaultMetadata;

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-muted w-full flex min-h-dvh flex-col items-center justify-center p-6 py-0">
      {children}
    </div>
  );
}
