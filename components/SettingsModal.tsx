import React from 'react';
import { X, Moon, Sun, Smartphone, Maximize } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isCompactMode: boolean;
  toggleCompactMode: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  toggleDarkMode,
  isCompactMode,
  toggleCompactMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-800 transform transition-all scale-100">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Customize
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'}`}>
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="font-semibold dark:text-white">Appearance</p>
                <p className="text-sm text-slate-500">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isDarkMode ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Compact Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                {isCompactMode ? <Smartphone size={20} /> : <Maximize size={20} />}
              </div>
              <div>
                <p className="font-semibold dark:text-white">Layout</p>
                <p className="text-sm text-slate-500">{isCompactMode ? 'Compact' : 'Comfortable'}</p>
              </div>
            </div>
            <button
              onClick={toggleCompactMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isCompactMode ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isCompactMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="p-6 pt-2">
           <p className="text-xs text-center text-slate-400">
             Settings are saved automatically to your browser.
           </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;