import { Bell, Settings } from 'lucide-react';
import { useAppStore } from '../../store/app-store.ts';

const viewTitles: Record<string, string> = {
  marketplace: 'Agent Marketplace',
  builder: 'Agent Builder',
  dashboard: 'Command Center',
  explorer: 'Protocol Explorer',
};

export function TopBar() {
  const currentView = useAppStore(s => s.currentView);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/5 bg-background/60 px-6 backdrop-blur-lg">
      <div>
        <h2 className="text-sm font-semibold text-gray-200">{viewTitles[currentView]}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors">
          <Bell size={16} />
        </button>
        <button className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
