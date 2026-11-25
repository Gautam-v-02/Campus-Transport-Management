import "./globals.css";
import "leaflet/dist/leaflet.css";
import ThemeToggle from "@/components/ThemeToggle";
import Script from "next/script";

export const metadata = {
  title: "CampusTransit | Real-Time Campus Mobility",
  description: "Real-time campus shuttle tracking, capacity monitoring, and last-mile ride discovery.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try { document.documentElement.dataset.theme = localStorage.getItem("campus-transit-theme") === "dark" ? "dark" : "light"; } catch {}`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
