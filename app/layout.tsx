import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import 'react-quill-new/dist/quill.snow.css';
import {ToastContainer} from "react-toastify";

export const metadata: Metadata = {
  title: "Atletica Padre Pio",
  description: "Atletica Padre Pio – sito ufficiale San Giovanni Rotondo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`antialiased`} suppressHydrationWarning>
        {children}
        <ToastContainer position="bottom-right" limit={1} />
      </body>
    </html>
  );
}
