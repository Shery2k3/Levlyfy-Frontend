import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import NavigationWrapper from "@/components/navigation-wrapper";
import { AuthProvider } from "@/context/AuthContext";
import { TwilioProvider } from "@/context/TwilioContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Level Up CRM",
  description: "Sales performance and training dashboard",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black`}>
        <AuthProvider>
          <TwilioProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <NavigationWrapper>{children}</NavigationWrapper>
            </ThemeProvider>
          </TwilioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
