import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { CommandMenuProvider } from "@/components/providers/CommandMenuContext";

export const metadata = {
  title: "Live Map - A World Map of Countries",
  description: "A world map of countries and update for each request.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased scroll-smooth">
      <body
        className={`${GeistSans.className} bg-zinc-100 dark:bg-zinc-900 selection:bg-zinc-400/25 dark:selection:bg-zinc-600/25 relative`}
      >
        <CommandMenuProvider>
          {children}
        </CommandMenuProvider>
      </body>
    </html>
  );
}
