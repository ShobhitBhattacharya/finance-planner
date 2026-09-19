import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Goalwise | Financial planning simulator",
  description: "A transparent, goal-based financial planning simulator for India.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
