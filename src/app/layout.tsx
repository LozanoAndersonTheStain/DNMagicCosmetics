import { bodySource } from "@/config/fonts";
import "./globals.css";
import LoadingScreen from "@/components/ui/screen/LoadingScreen";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D&N Magic Cosmetics",
  description:
    "D&N Magic Cosmetics es el sitio perfecto para encontar los productos de belleza que tanto has buscado y resaltar tu belleza natural.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={bodySource.className} suppressHydrationWarning>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}