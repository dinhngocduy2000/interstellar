import type { Metadata } from "next";
import "../../assets/style/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DefaultMetadata } from "@/lib/utils";
import HeaderComponent from "@/components/layout/header";
import { AppSidebarComponent } from "@/components/layout/sidebar";
import ReactQueryProviders from "@/components/providers/react-query-provider";

export const metadata: Metadata = DefaultMetadata;

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProviders>
      <SidebarProvider>
        <main className="box-border flex h-screen w-screen justify-center">
          <AppSidebarComponent />
          <SidebarInset>
            <main className="flex h-full flex-1 flex-col overflow-auto rounded-lg bg-default">
              <HeaderComponent />
              <main className="flex overflow-auto flex-1 flex-col gap-4 p-4 pt-0">
                {children}
              </main>
              {/* <FooterComponent /> */}
            </main>
          </SidebarInset>
        </main>
      </SidebarProvider>
    </ReactQueryProviders>
  );
}
