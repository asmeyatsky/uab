import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { MarketplacePage } from './pages/MarketplacePage';
import { DashboardPage } from './pages/DashboardPage';
import { AgentBuilderPage } from './pages/AgentBuilderPage';

function App() {
  const [currentView, setCurrentView] = useState('marketplace');

  const renderContent = () => {
    switch (currentView) {
      case 'marketplace':
        return <MarketplacePage />;
      case 'builder':
        return <AgentBuilderPage />;
      case 'dashboard':
        return <DashboardPage />;
      default:
        return <MarketplacePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <main className="pl-64 min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
