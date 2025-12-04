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
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-300">
      <div className={`relative ${compact ? 'h-32' : 'h-48'} bg-gradient-to-r from-blue-700 to-indigo-900 flex flex-col justify-between p-6 overflow-hidden`}>
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400 opacity-10 rounded-full -ml-10 -mb-10 blur-xl"></div>

        {/* Content */}
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md mb-2">
                    <Train size={12} />
                    {data.train_number}
                </span>
                <h1 className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-white tracking-tight`}>
                    {data.train_name}
                </h1>
            </div>
            <div className={`flex flex-col items-end ${isDelayed ? 'text-amber-300' : 'text-emerald-300'}`}>
                <span className="text-sm font-medium opacity-80 uppercase tracking-wider">Status</span>
                <span className="text-xl font-bold flex items-center gap-2">
                    {isDelayed ? (
                        <>
                            <Clock size={20} /> Delayed {data.delay}m
                        </>
                    ) : (
                        <>
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            On Time
                        </>
                    )}
                </span>
            </div>
        </div>

        {/* Route Text */}
        {!compact && (
          <div className="relative z-10 flex justify-between text-white/80 text-sm font-medium mt-auto">
             <div className="flex items-center gap-2">
                <span>{data.source_stn_name}</span>
             </div>
             <div className="flex items-center gap-2">
                <span>{data.dest_stn_name}</span>
             </div>
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div className="p-6">
        <div className="flex justify-between items-end mb-2">
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Distance Covered</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {data.distance_from_source} <span className="text-base font-normal text-slate-400">/ {data.total_distance} km</span>
                </p>
            </div>
            <div className="text-right">
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{Math.round(percentage)}%</p>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${percentage}%` }}
            >
                {/* Shimmer effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-[shimmer_2s_infinite]"></div>
            </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
             <span className="flex items-center gap-1"><MapPin size={12}/> {data.source_stn_name}</span>
             <span className="flex items-center gap-1"><MapPin size={12}/> {data.dest_stn_name}</span>
        </div>
      </div>
    </div>
  );
};

export default TrainHero;