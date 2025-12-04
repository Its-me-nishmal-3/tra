import React, { useState, useEffect } from 'react';
import { Settings, TrainFrontTunnel, ArrowLeft, RotateCcw } from 'lucide-react';
import { MOCK_DATA } from './constants';
import TrainHero from './components/TrainHero';
import LiveStatusCard from './components/LiveStatusCard';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import SettingsModal from './components/SettingsModal';
import SearchScreen from './components/SearchScreen';

const App: React.FC = () => {
  // State for Settings
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cipherTrack_darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [isCompactMode, setIsCompactMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cipherTrack_compactMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Effect to apply Dark Mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cipherTrack_darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Effect to save compact mode
  useEffect(() => {
    localStorage.setItem('cipherTrack_compactMode', JSON.stringify(isCompactMode));
  }, [isCompactMode]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
        setHasSearched(true);
        setIsLoading(false);
    }, 1200);
  };

  const handleReset = () => {
      setHasSearched(false);
      setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-8 animate-fade-in-down sticky top-0 z-50 py-2 bg-gray-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={hasSearched ? handleReset : undefined}>
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 text-white transform transition-transform hover:scale-105 active:scale-95">
                <TrainFrontTunnel size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">CipherTrack</h1>
                <p className="text-xs text-slate-500 font-medium">Live Status</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            {hasSearched && (
                 <button 
                    onClick={handleReset}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm hidden md:flex"
                    title="Search Again"
                 >
                    <RotateCcw size={20} />
                 </button>
            )}
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
                <Settings size={20} />
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[60vh]">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[50vh] animate-fade-in">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <TrainFrontTunnel size={20} className="text-indigo-600 opacity-50" />
                    </div>
                </div>
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Locating Train {searchQuery}...</p>
            </div>
        ) : !hasSearched ? (
            <SearchScreen onSearch={handleSearch} />
        ) : (
            <div className="space-y-6 animate-fade-in-up">
                
                {/* Back Button Mobile */}
                <button onClick={handleReset} className="md:hidden flex items-center gap-2 text-slate-500 mb-2">
                    <ArrowLeft size={16} /> Search Again
                </button>

                {/* Hero Section */}
                <TrainHero data={MOCK_DATA} compact={isCompactMode} />

                {/* Live Status Details */}
                <LiveStatusCard data={MOCK_DATA} />

                {/* Timeline */}
                <Timeline data={MOCK_DATA} compact={isCompactMode} />
            </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isCompactMode={isCompactMode}
        toggleCompactMode={() => setIsCompactMode(!isCompactMode)}
      />
      </div>
    </div>
  );
};

export default App;