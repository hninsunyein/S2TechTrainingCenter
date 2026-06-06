import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ClientToaster from './ClientToaster';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'S2 Tech Training Center',
  description: 'Coding and English vocabulary for children aged 5–14. Scratch, Python, EVC — online via Zoom or in-person in Chiang Mai.',
};

const themeScript = `(function(){try{var t=localStorage.getItem('s2-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={jakarta.className} suppressHydrationWarning>
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-component */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <ClientToaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
