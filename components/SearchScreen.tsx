import React, { useState } from 'react';
import { Search, Train, ArrowRight, Clock, Map } from 'lucide-react';

interface SearchScreenProps {
  onSearch: (trainNo: string) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onSearch }) => {
  const [trainNo, setTrainNo] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trainNo.trim()) {
      onSearch(trainNo);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-fade-in-up">
      <div className="w-full max-w-md space-y-8 text-center">
        
        {/* Logo / Icon */}
        <div className="relative mx-auto w-24 h-24 mb-6 group">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="relative w-full h-full bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl rotate-3 shadow-xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300">
            <Train size={48} className="text-white" />
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Journey</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Real-time status, sleek & simple.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative group">
          <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${isFocused ? 'opacity-75' : ''}`}></div>
          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden p-2 ring-1 ring-slate-900/5">
            <div className="pl-4 text-slate-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={trainNo}
              onChange={(e) => setTrainNo(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter Train Number (e.g. 16650)"
              className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 h-12 text-lg font-medium"
            />
            <button
              type="submit"
              disabled={!trainNo}
              className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>Go</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
            <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-2xl text-blue-500">
              <Clock size={20} />
            </div>
            <span className="text-xs font-semibold">Real-time</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
            <div className="p-3 bg-purple-50 dark:bg-slate-800 rounded-2xl text-purple-500">
              <Map size={20} />
            </div>
            <span className="text-xs font-semibold">Live Map</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
            <div className="p-3 bg-pink-50 dark:bg-slate-800 rounded-2xl text-pink-500">
              <Train size={20} />
            </div>
            <span className="text-xs font-semibold">Accurate</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SearchScreen;