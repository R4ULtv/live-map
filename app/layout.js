import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { CommandMenuProvider } from "@/components/providers/CommandMenuContext";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Live Map - Simple World Map",
  description:
    "A world map with stats and general information for each country.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <body
        className={`${GeistSans.className} bg-zinc-100 dark:bg-zinc-900 selection:bg-zinc-400/25 dark:selection:bg-zinc-600/25 relative`}
      >
        <ThemeProvider attribute="class" enableSystem={false}>
          <CommandMenuProvider>{children}</CommandMenuProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
