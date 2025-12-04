import React, { useState, useEffect } from 'react';
import { Settings, TrainFrontTunnel, ArrowLeft, RotateCcw } from 'lucide-react';
import { TrainData } from './types';
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

  // Data States
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trainData, setTrainData] = useState<TrainData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Apply Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cipherTrack_darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Persist Compact Mode
  useEffect(() => {
    localStorage.setItem('cipherTrack_compactMode', JSON.stringify(isCompactMode));
  }, [isCompactMode]);

  const fetchTrainData = async (trainNo: string) => {
    setIsLoading(true);
    setError(null);
    setTrainData(null);

    try {
      // Using AllOrigins proxy to bypass CORS for the RailYatri API
      const targetUrl = `https://livestatus.railyatri.in/api/v3/train_eta_data/${trainNo}/0.json?start_day=0`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const jsonData = JSON.parse(data.contents); // AllOrigins returns stringified JSON in 'contents'

      if (!jsonData.train_number && !jsonData.train_name) {
         throw new Error('Train not found or data unavailable');
      }

      setTrainData(jsonData);
      setHasSearched(true);
      setSearchQuery(trainNo);
    } catch (err) {
      console.error(err);
      setError('Could not fetch train status. Please check the train number and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setHasSearched(false);
    setTrainData(null);
    setError(null);
  };

  const handleRefresh = () => {
    if (searchQuery) {
        fetchTrainData(searchQuery);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950' : 'bg-gray-50'}`}>
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleBack}>
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
               <TrainFrontTunnel size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">
              Cipher<span className="text-indigo-600 dark:text-indigo-400">Track</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {hasSearched && (
                 <button 
                  onClick={handleRefresh}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Refresh Data"
                >
                  <RotateCcw size={20} className={isLoading ? "animate-spin" : ""} />
                </button>
            )}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto min-h-[calc(100vh-80px)]">
        
        {/* Settings Modal */}
        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isCompactMode={isCompactMode}
          toggleCompactMode={() => setIsCompactMode(!isCompactMode)}
        />

        {!hasSearched ? (
          /* Search View */
          <div className="animate-fade-in">
             <SearchScreen onSearch={fetchTrainData} />
             {isLoading && (
                 <div className="mt-8 flex flex-col items-center justify-center text-slate-500">
                     <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                     <p>Locating Train...</p>
                 </div>
             )}
             {error && (
                 <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-center max-w-md mx-auto animate-fade-in-up">
                     {error}
                 </div>
             )}
          </div>
        ) : trainData ? (
          /* Results View */
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2 text-slate-500 hover:text-indigo-600 cursor-pointer w-fit transition-colors" onClick={handleBack}>
                <ArrowLeft size={16} />
                <span className="text-sm font-medium">Search another train</span>
            </div>

            {/* Hero Section */}
            <TrainHero data={trainData} compact={isCompactMode} />

            {/* Live Status Card */}
            <LiveStatusCard data={trainData} />

            {/* Timeline */}
            <Timeline data={trainData} compact={isCompactMode} />
          </div>
        ) : (
           /* Loading State for Results (should rarely hit this due to logic above) */
           <div className="flex flex-col items-center justify-center h-64">
               <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-slate-500">Loading live status...</p>
           </div>
        )}

        <Footer />
      </main>
    </div>
  );
};

export default App;