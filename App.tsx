import React, { useState, useEffect, useCallback } from 'react';
import { Settings, TrainFrontTunnel, ArrowLeft, RotateCcw, Wifi } from 'lucide-react';
import { TrainData } from './types';
import TrainHeader from './components/TrainHeader';
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
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isBackgroundUpdating, setIsBackgroundUpdating] = useState(false);
  const [trainData, setTrainData] = useState<TrainData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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

  const fetchTrainData = useCallback(async (trainNo: string, isBackground: boolean = false) => {
    if (!isBackground) {
      setIsInitialLoading(true);
      setError(null);
    } else {
      setIsBackgroundUpdating(true);
    }

    try {
      // Using AllOrigins proxy to bypass CORS for the RailYatri API
      const targetUrl = `https://livestatus.railyatri.in/api/v3/train_eta_data/${trainNo}/0.json?start_day=0`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&timestamp=${new Date().getTime()}`;

      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const jsonData = JSON.parse(data.contents); // AllOrigins returns stringified JSON in 'contents'

      if (!jsonData.train_number && !jsonData.train_name) {
         throw new Error('Train not found or data unavailable');
      }

      setTrainData(jsonData);
      if (!isBackground) {
        setHasSearched(true);
        setSearchQuery(trainNo);
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      if (!isBackground) {
        setError('Could not fetch train status. Please check the train number and try again.');
      }
    } finally {
      if (!isBackground) {
        setIsInitialLoading(false);
      } else {
        setIsBackgroundUpdating(false);
      }
    }
  }, []);

  // Auto-refresh logic (every 30 seconds)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (hasSearched && trainData && !error) {
      interval = setInterval(() => {
        console.log('Auto-refreshing data...');
        fetchTrainData(searchQuery, true);
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasSearched, trainData, error, searchQuery, fetchTrainData]);

  const handleBack = () => {
    setHasSearched(false);
    setTrainData(null);
    setError(null);
  };

  const handleRefresh = () => {
    if (searchQuery) {
        fetchTrainData(searchQuery, false);
    }
  };

  return (
    <div className={`h-screen w-full overflow-hidden transition-colors duration-300 flex flex-col ${isDarkMode ? 'dark bg-slate-950' : 'bg-gray-50'}`}>
      
      {/* Navigation Bar */}
      <nav className="shrink-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-14 sm:h-16">
        <div className="max-w-[1920px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleBack}>
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
               <TrainFrontTunnel size={18} className="sm:w-5 sm:h-5" />
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-800 dark:text-white block">
              Cipher<span className="text-indigo-600 dark:text-indigo-400">Track</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {hasSearched && (
              <div className="flex items-center gap-2 mr-1 sm:mr-2">
                 {isBackgroundUpdating && (
                   <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                      <span className="text-[10px] sm:text-xs text-indigo-600 dark:text-indigo-400 font-medium hidden sm:inline">Updating</span>
                   </div>
                 )}
                 <button 
                  onClick={handleRefresh}
                  className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors ${isBackgroundUpdating ? 'opacity-50' : ''}`}
                  title="Refresh Data"
                >
                  <RotateCcw size={18} className={isInitialLoading || isBackgroundUpdating ? "animate-spin" : "sm:w-5 sm:h-5"} />
                </button>
              </div>
            )}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Settings size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        
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
          /* Search View - Centered and Scrollable if needed */
          <div className="h-full w-full overflow-y-auto flex flex-col">
             <div className="flex-1 flex flex-col items-center justify-center p-4">
                <SearchScreen onSearch={(no) => fetchTrainData(no, false)} />
                {isInitialLoading && (
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
             <div className="shrink-0 pb-6">
                 <Footer />
             </div>
          </div>
        ) : trainData ? (
          /* Results View - Dashboard Layout (100vh locked) */
          <div className="h-full w-full flex flex-col p-2 sm:p-4 gap-2 sm:gap-4 max-w-[1920px] mx-auto animate-fade-in-up">
            
            {/* Top Bar: Back Link & Last Update */}
            <div className="flex items-center justify-between shrink-0 px-1">
                <div className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors group" onClick={handleBack}>
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Search another</span>
                </div>
                {lastUpdated && (
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
                        <Wifi size={10} className="text-emerald-500" />
                        <span>Live</span>
                    </div>
                )}
            </div>

            {/* Upper Dashboard Section: Merged Header */}
            <TrainHeader data={trainData} />

            {/* Lower Dashboard Section: Timeline (Fills remaining space) */}
            <div className="flex-1 min-h-0 relative">
               <Timeline data={trainData} compact={isCompactMode} />
            </div>
            
            {/* Mini Footer embedded for this view */}
            <div className="shrink-0 text-center py-1">
                 <p className="text-[9px] text-slate-300 dark:text-slate-600">Powered by CipherNichu</p>
            </div>
          </div>
        ) : (
           /* Loading State */
           <div className="h-full flex flex-col items-center justify-center">
               <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-slate-500">Loading live status...</p>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;