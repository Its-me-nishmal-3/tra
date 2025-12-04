import React from 'react';
import { TrainData } from '../types';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';

interface LiveStatusCardProps {
  data: TrainData;
}

const LiveStatusCard: React.FC<LiveStatusCardProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Current Location */}
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <MapPin size={16} />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Location</h3>
            </div>
            <div className="pl-10">
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{data.current_station_name.replace('~', '')}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{data.ahead_distance_text}</p>
                <p className="text-xs text-slate-400 mt-2">Updated: {new Date(data.update_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>

        {/* Next Stop */}
        <div className="flex-1">
             <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Navigation size={16} />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Next Stop</h3>
            </div>
             <div className="pl-10">
                <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{data.next_stoppage_info?.next_stoppage}</p>
                    <ArrowRight size={16} className="text-slate-400" />
                </div>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mt-1">{data.next_stoppage_info?.next_stoppage_time_diff}</p>
                <p className="text-xs text-slate-400 mt-2">{data.upcoming_stations[0]?.distance_from_current_station_txt}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStatusCard;