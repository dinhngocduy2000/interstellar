import type { Metadata } from "next";
import "@/assets/style/globals.css";
import { DefaultMetadata } from "@/lib/utils";
import AppLogoComponent from "@/components/reusable/app-logo-component";

export const metadata: Metadata = DefaultMetadata;

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-muted w-full flex min-h-dvh flex-col gap-4 items-center p-6 py-12">
      <AppLogoComponent width={70} height={70} />
      <span className="font-bold text-2xl">Interstellar</span>
      {children}
    </div>
  );
}
