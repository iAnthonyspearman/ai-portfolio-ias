import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Portfolio IAS | Intelligence Automation Systems",
  description:
    "Portfolio 7.0 showcase of eight AI systems covering deployment, workflows, enterprise orchestration, autonomous operations, and institutional market intelligence.",
  applicationName: "AI Portfolio IAS",
  openGraph: {
    title: "AI Portfolio IAS | Intelligence Automation Systems",
    description:
      "Portfolio 7.0 showcase of eight AI systems with live demos, maturity path, 3D orb systems, and real-world business value.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Portfolio IAS | Intelligence Automation Systems",
    description:
      "Eight AI systems presented through the approved Portfolio 7.0 visual experience.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
