import React from 'react';
import { TrainData } from '../types';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';

interface LiveStatusCardProps {
  data: TrainData;
}

const LiveStatusCard: React.FC<LiveStatusCardProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 relative overflow-hidden h-full min-h-[140px] flex flex-col justify-center">
      
      <div className="flex items-start justify-between gap-4 h-full">
        
        {/* Current Location */}
        <div className="flex-1 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-1.5 mb-1 text-slate-500 dark:text-slate-400">
                    <MapPin size={12} className="text-blue-500" />
                    <h3 className="text-[10px] font-bold uppercase tracking-wider">Current Location</h3>
                </div>
                <p className="text-lg font-bold text-slate-800 dark:text-white leading-tight truncate" title={data.current_station_name}>
                    {data.current_station_name.replace('~', '')}
                </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded-lg border border-blue-100 dark:border-blue-900/20">
                <p className="text-blue-600 dark:text-blue-400 text-xs font-medium leading-tight">
                    {data.ahead_distance_text}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                    Updated {new Date(data.update_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
            </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-slate-100 dark:bg-slate-800 h-full"></div>

        {/* Next Stop */}
        <div className="flex-1 flex flex-col justify-between">
             <div>
                <div className="flex items-center gap-1.5 mb-1 text-slate-500 dark:text-slate-400">
                    <Navigation size={12} className="text-purple-500" />
                    <h3 className="text-[10px] font-bold uppercase tracking-wider">Next Stop</h3>
                </div>
                <div className="flex items-center gap-1">
                    <p className="text-lg font-bold text-slate-800 dark:text-white leading-tight truncate" title={data.next_stoppage_info?.next_stoppage}>
                        {data.next_stoppage_info?.next_stoppage}
                    </p>
                </div>
             </div>
             <div className="bg-purple-50 dark:bg-purple-900/10 p-2 rounded-lg border border-purple-100 dark:border-purple-900/20">
                <p className="text-purple-600 dark:text-purple-400 font-bold text-xs">
                    {data.next_stoppage_info?.next_stoppage_time_diff}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight truncate">
                   {data.upcoming_stations[0]?.distance_from_current_station_txt}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStatusCard;