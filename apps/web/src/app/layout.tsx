import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { PlayerProvider } from '@/lib/PlayerContext';
import Miniplayer from '@/components/Miniplayer';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';

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
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#0b0c10] text-[#f8fafc] antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <PlayerProvider>
          <Header />
          <div className="flex flex-1 pt-14">
            <Sidebar />
            <main className="flex-1 min-w-0 pb-16 md:pb-0 overflow-y-auto">
              {children}
            </main>
          </div>
          <Miniplayer />
          <KeyboardShortcutsModal />
        </PlayerProvider>
      </body>
    </html>
  );
}
