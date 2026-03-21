import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "AgentsClan — Enter the Clan",
  description: "Welcome to the AgentsClan Web3 community.",
};

export default function GateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="m-0 p-0 bg-black overflow-hidden">
        {children}
      </body>
    </html>
  );
}

