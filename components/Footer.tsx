import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 pb-8 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
        <span>Powered by</span>
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold text-lg">
          CipherNichu
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-1">
        Made with <Heart size={12} className="text-red-500 fill-current" /> for travelers
      </p>
    </footer>
  );
};

export default Footer;