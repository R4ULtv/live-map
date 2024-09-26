import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { CommandMenuProvider } from "@/components/providers/CommandMenuContext";
import { ThemeProvider } from "next-themes";

export const metadata = {
  metadataBase: process.env.HOST_NAME,
  title: "Live Map - Simple World Map",
  description:
    "A world map with stats and general information for each country.",
  openGraph: {
    title: "Live Map - Simple World Map",
    description:
      "A world map with stats and general information for each country.",
    url: process.env.HOST_NAME,
    images: [
      {
        url: `https://www.raulcarini.dev/api/dynamic-og?title=Live%20Map&description=A%20world%20map%20with%20stats%20and%20general%20information%20for%20each%20country.`,
        width: 843,
        height: 441,
      },
    ],
  },
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
