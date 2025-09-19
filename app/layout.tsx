import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/navbar"

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins', // Defines a CSS variable for the font
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Specify desired weights
});

export const metadata: Metadata = {
  title: "Lumos - Calculadora",
  description: "Calculadora de penas do Código Penal - Lumos RP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${poppins.variable} antialiased`}
      >
      {/*<Navbar />*/}
        {children}
      </body>
    </html>
  );
}
