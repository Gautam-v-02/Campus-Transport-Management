import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "CampusTransit | Real-Time Campus Mobility",
  description: "Real-time campus shuttle tracking, capacity monitoring, and last-mile ride discovery.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
