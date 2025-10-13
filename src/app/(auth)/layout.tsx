import type { Metadata } from "next";
import "@/assets/style/globals.css";
import AppLogoComponent from "@/components/reusable/app-logo-component";
import { DefaultMetadata } from "@/lib/utils";

export const metadata: Metadata = DefaultMetadata;

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center gap-4 bg-muted p-6 py-12">
      <AppLogoComponent width={70} height={70} />
      <span className="font-bold text-2xl">Interstellar</span>
      {children}
    </div>
  );
}
