import React from 'react';
import { TrainData } from '../types';
import { Train, Clock, MapPin, Navigation, ArrowRight } from 'lucide-react';

interface TrainHeaderProps {
  data: TrainData;
}

const TrainHeader: React.FC<TrainHeaderProps> = ({ data }) => {
  const isDelayed = data.delay > 10;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 shrink-0 transition-colors duration-300">
      <div className="flex flex-col gap-4">
        
        {/* Top Row: Train Identity & Status */}
        <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <Train size={10} />
                        {data.train_number}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isDelayed 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                        <Clock size={10} />
                        {isDelayed ? `Delayed ${data.delay} min` : 'On Time'}
                    </span>
                </div>
                <h1 className="text-base sm:text-lg font-black text-slate-800 dark:text-white truncate leading-tight">
                    {data.train_name}
                </h1>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    <span className="truncate max-w-[80px] sm:max-w-none">{data.source_stn_name}</span>
                    <ArrowRight size={10} />
                    <span className="truncate max-w-[80px] sm:max-w-none">{data.dest_stn_name}</span>
                </div>
            </div>

            {/* Updated Time Badge */}
            <div className="text-[9px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full whitespace-nowrap hidden sm:block">
                Updated {new Date(data.update_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
        </div>

        {/* Bottom Row: Live Context (Merged Cards) */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {/* Current Location */}
            <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                    <MapPin size={10} className="text-blue-500" />
                    <span>Now At</span>
                </div>
                <div className="font-bold text-slate-700 dark:text-slate-200 text-sm truncate" title={data.current_station_name}>
                    {data.current_station_name.replace('~', '')}
                </div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 truncate font-medium">
                    {data.ahead_distance_text}
                </div>
            </div>

            {/* Next Stop */}
            <div className="min-w-0 pl-3 border-l border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 mb-0.5 text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                    <Navigation size={10} className="text-purple-500" />
                    <span>Next Stop</span>
                </div>
                <div className="font-bold text-slate-700 dark:text-slate-200 text-sm truncate" title={data.next_stoppage_info?.next_stoppage}>
                    {data.next_stoppage_info?.next_stoppage || "N/A"}
                </div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 truncate font-medium">
                    {data.next_stoppage_info?.next_stoppage_time_diff || "--"}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default TrainHeader;