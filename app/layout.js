import "./globals.css";

export const metadata = {
  title: "Freedom Family | The Round Table",
  description: "Build Your Legacy. Where vision meets action.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}