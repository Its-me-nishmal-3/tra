import React from 'react';
import { TrainData } from '../types';
import { Train, Clock, MapPin } from 'lucide-react';

interface TrainHeroProps {
  data: TrainData;
  compact: boolean;
}

const TrainHero: React.FC<TrainHeroProps> = ({ data, compact }) => {
  const percentage = Math.min(
    100,
    Math.max(0, (data.distance_from_source / data.total_distance) * 100)
  );

  const isDelayed = data.delay > 10;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between h-full min-h-[140px]">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-900 p-4 relative overflow-hidden shrink-0">
         {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>

        <div className="relative z-10 flex justify-between items-start">
            <div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white backdrop-blur-md mb-1">
                    <Train size={10} />
                    {data.train_number}
                </span>
                <h1 className="text-lg font-bold text-white tracking-tight leading-tight truncate max-w-[200px]">
                    {data.train_name}
                </h1>
                <div className="flex items-center gap-2 text-white/70 text-xs mt-1">
                    <span>{data.source_stn_name}</span>
                    <span className="opacity-50">→</span>
                    <span>{data.dest_stn_name}</span>
                </div>
            </div>
            
            <div className={`flex flex-col items-end ${isDelayed ? 'text-amber-300' : 'text-emerald-300'}`}>
                <span className="text-lg font-bold flex items-center gap-1.5">
                    {isDelayed ? (
                        <>
                            <Clock size={16} /> <span className="text-sm">Delayed {data.delay}m</span>
                        </>
                    ) : (
                        <>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm">On Time</span>
                        </>
                    )}
                </span>
            </div>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-center flex-1">
         <div className="flex justify-between items-end mb-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Progress</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{Math.round(percentage)}%</span>
         </div>
         <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                style={{ width: `${percentage}%` }}
            >
            </div>
         </div>
         <div className="mt-2 flex justify-between text-[10px] text-slate-400">
             <span>{data.distance_from_source} km</span>
             <span>{data.total_distance} km</span>
         </div>
      </div>
    </div>
  );
};

export default TrainHero;