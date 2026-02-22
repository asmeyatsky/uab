import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
  Store, Wrench, BarChart3, BookOpen,
  ChevronLeft, ChevronRight, Hexagon,
} from 'lucide-react';
import { useAppStore, type ViewId } from '../../store/app-store.ts';

interface NavItem {
  id: ViewId;
  label: string;
  icon: typeof Store;
}

const navItems: NavItem[] = [
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'builder', label: 'Agent Builder', icon: Wrench },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'explorer', label: 'Protocols', icon: BookOpen },
];

export function Sidebar() {
  const currentView = useAppStore(s => s.currentView);
  const setView = useAppStore(s => s.setView);
  const collapsed = useAppStore(s => s.sidebarCollapsed);
  const toggleSidebar = useAppStore(s => s.toggleSidebar);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-30 flex h-full flex-col border-r border-white/10 bg-background/80 backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
          <Hexagon size={18} />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-sm font-bold text-gray-100">UAB</span>
            <span className="ml-1 text-[10px] font-mono text-gray-500">2026</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = currentView === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              className={clsx(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200',
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
              {active && !collapsed && (
                <motion.div
                  layoutId="nav-indicator"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Protocol count */}
      {!collapsed && (
        <div className="border-t border-white/10 p-4">
          <div className="rounded-lg bg-white/[0.03] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Protocol Stack</p>
            <p className="text-lg font-bold font-mono text-primary">10</p>
            <p className="text-[10px] text-gray-600">protocols integrated</p>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="flex h-10 items-center justify-center border-t border-white/10 text-gray-500 hover:text-gray-300 transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
}
