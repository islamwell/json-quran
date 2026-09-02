import React from 'react';
import '../style.css';

export const metadata = {
  title: 'Surah Al-Kawthar (108) — Grammar, Syntax Tree & AI Tutor',
  description: 'Word-by-word Quranic grammatical intelligence, visual syntax tree, and multi-tier AI linguistic tutor for Surah Al-Kawthar (108).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
