import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { PlayerProvider } from '@/lib/PlayerContext';
import Miniplayer from '@/components/Miniplayer';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import CookieConsent from '@/components/CookieConsent';

export const metadata: Metadata = {
  title: 'VIONEX - Original High-Performance Video Platform',
  description: 'Next-generation video streaming, sharing, creator studio, and community platform.',
  icons: { icon: '/favicon.ico' }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-[#0F0F0F] antialiased selection:bg-red-500/20 selection:text-red-700">
        <PlayerProvider>
          <Header />
          <div className="flex flex-1 pt-14">
            <Sidebar />
            <main className="flex-1 min-w-0 pb-16 md:pb-0 overflow-y-auto bg-white">
              {children}
            </main>
          </div>
          <Miniplayer />
          <KeyboardShortcutsModal />
          <CookieConsent />
        </PlayerProvider>
      </body>
    </html>
  );
}
