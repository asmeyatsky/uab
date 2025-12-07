import { LayoutGrid, Bot, BarChart3, Settings, Hexagon } from 'lucide-react';

interface SidebarProps {
    currentView: string;
    onChangeView: (view: string) => void;
}

export function Sidebar({ currentView, onChangeView }: SidebarProps) {
    const menuItems = [
        { id: 'marketplace', icon: LayoutGrid, label: 'Marketplace' },
        { id: 'builder', icon: Bot, label: 'Agent Builder' },
        { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-64 border-r border-white/10 flex flex-col bg-background/50 backdrop-blur-xl h-screen fixed left-0 top-0 z-50">
            <div className="p-6 flex items-center gap-3">
                <Hexagon className="text-primary animate-pulse" size={32} />
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    AMX
                </h1>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onChangeView(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === item.id
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,243,255,0.1)]'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="glass-panel p-4 rounded-xl">
                    <div className="text-xs text-gray-400 mb-2">Wallet Balance</div>
                    <div className="text-xl font-mono font-bold text-white flex items-center justify-between">
                        2,450 <span className="text-xs text-primary bg-primary/20 px-1 rounded">AMX</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
