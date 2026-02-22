import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/app-store.ts';
import { Sidebar } from './Sidebar.tsx';
import { TopBar } from './TopBar.tsx';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const collapsed = useAppStore(s => s.sidebarCollapsed);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <motion.div
        animate={{ marginLeft: collapsed ? 64 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1"
      >
        <TopBar />
        <main className="min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
