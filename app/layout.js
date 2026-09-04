import localFont from 'next/font/local';
import './globals.css';

const mono = localFont({ src: '../fonts/IBMPlexMono-Regular.ttf' });

export const metadata = {
  metadataBase: new URL('https://diogomota.com'),
  title: { default: 'Diogo Mota', template: '%s - Diogo Mota' },
  description: 'Apps by Diogo Mota',
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={mono.className}>{children}</body>
    </html>
  );
}
