import "./globals.css";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: "Freedom Family",
  description: "Info Session & Training · Every Monday · 7:30 PM · Embassy Suites, College Station TX · Dress: Business Professional",
  openGraph: {
    title: "Freedom Family",
    description: "Info Session & Training · Every Monday · 7:30 PM · Embassy Suites, College Station TX",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Freedom Family - Info Session & Training",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freedom Family",
    description: "Info Session & Training · Every Monday · 7:30 PM · Embassy Suites, College Station TX",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FreeFam" />
        <meta name="theme-color" content="#1a1a1a" />
      </head>
      <body>{children}</body>
    </html>
  );
}
