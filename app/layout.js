import "./globals.css";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: "Freedom Family | The Round Table",
  description: "Info Session & Training · Every Monday · 7:30 PM · Embassy Suites, College Station TX · Dress: Business Professional",
  openGraph: {
    title: "Freedom Family | The Round Table",
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
    title: "Freedom Family | The Round Table",
    description: "Info Session & Training · Every Monday · 7:30 PM · Embassy Suites, College Station TX",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
