import type { Metadata } from "next";
import "./globals.css";

const title = "Binary Timber Holdings — Where Code Meets Craft";
const description =
  "Binary Timber Holdings is a tech holding company spanning AI software development and custom CNC manufacturing — where code meets craft.";

export const metadata: Metadata = {
  metadataBase: new URL("https://binarytimber.com"),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title,
    description,
    url: "https://binarytimber.com",
    images: ["/hort.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/hort.png"],
  },
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/apple-touch-icon.png",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Binary Timber Holdings, LLC",
  url: "https://binarytimber.com",
  description:
    "Tech holding company building at the intersection of intelligent software and precision manufacturing.",
  email: "hello@binarytimber.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Fonts: preconnect + font stylesheet (kept identical to the static site) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400&family=JetBrains+Mono:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
