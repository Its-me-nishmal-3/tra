import React, { useRef, useEffect } from 'react';
import { TrainData } from '../types';
import { Circle, MapPin, Clock } from 'lucide-react';

interface TimelineProps {
  data: TrainData;
  compact: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ data, compact }) => {
  // Combine history (limit to last 5) and upcoming
  // We include a bit more history for the scroll effect
  const historyToShow = data.previous_stations;
  const stations = [...historyToShow, ...data.upcoming_stations];
  
  // Find the index of the current or next station to scroll to
  const currentIndex = historyToShow.length > 0 ? historyToShow.length : 0;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to current station on mount
    if (scrollContainerRef.current) {
        const itemHeight = compact ? 80 : 100; // Approx height of an item
        // Scroll so the current station is roughly in the middle
        const scrollPos = (currentIndex * itemHeight) - (scrollContainerRef.current.clientHeight / 2) + itemHeight;
        scrollContainerRef.current.scrollTo({
            top: Math.max(0, scrollPos),
            behavior: 'smooth'
        });
    }
  }, [currentIndex, compact]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-[600px] transition-all duration-300">
      
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 flex justify-between items-center shrink-0">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <MapPin size={20} className="text-indigo-500" />
          Live Route
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
            {stations.length} Stations
        </span>
      </div>

      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative scroll-smooth custom-scrollbar"
      >
        {/* Curved Track Background - Decorative SVG Line */}
        <div className="absolute top-0 bottom-0 left-8 md:left-12 w-0.5 z-0">
             {/* We use a simple repeating gradient to simulate a track */}
             <div className="w-full h-full bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
        </div>

        <div className="py-6 px-4 md:px-8 space-y-0">
          {stations.map((station, index) => {
            const isPast = index < currentIndex;
            const isCurrent = index === currentIndex || (index === currentIndex - 1 && data.upcoming_stations.length > 0 && station.station_code === data.upcoming_stations[0].station_code);
            const isNext = index === currentIndex; // First upcoming
            
            // Curve simulation: Slight offset for visual interest
            // We'll use CSS transform to create a subtle wave if not compact
            const waveOffset = !compact && index % 2 === 0 ? 'md:translate-x-2' : '';

            return (
              <div 
                key={station.station_code} 
                className={`relative pl-12 md:pl-16 pr-2 py-4 group transition-all duration-500 ${waveOffset} ${compact ? 'py-2' : 'py-4'}`}
              >
                
                {/* Connector Curve (Visual trick using borders) */}
                <div className={`absolute left-8 md:left-12 top-0 bottom-0 w-6 border-l-2 border-slate-200 dark:border-slate-800 rounded-bl-3xl ${index === 0 ? 'top-1/2' : ''} ${index === stations.length - 1 ? 'bottom-1/2' : ''} opacity-0`}></div>

                {/* Station Node / Dot */}
                <div className="absolute left-[26px] md:left-[42px] top-1/2 -translate-y-1/2 z-10">
                   {isNext ? (
                       // Pulsing Current Station
                       <div className="relative h-5 w-5 md:h-6 md:w-6 flex items-center justify-center">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                           <div className="relative h-4 w-4 md:h-5 md:w-5 bg-indigo-600 rounded-full shadow-lg border-2 border-white dark:border-slate-900">
                                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                           </div>
                       </div>
                   ) : isPast ? (
                       // Past Station
                       <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-900 transition-colors group-hover:bg-indigo-300"></div>
                   ) : (
                       // Future Station
                       <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-white dark:bg-slate-800 border-2 border-indigo-400 dark:border-indigo-600"></div>
                   )}
                </div>

                {/* Card Content */}
                <div className={`
                    relative bg-white dark:bg-slate-800/50 rounded-2xl p-4 transition-all duration-300
                    ${isNext ? 'shadow-lg ring-1 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-900/10 translate-x-1' : 'hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md'}
                    ${isPast ? 'opacity-60 grayscale-[0.5]' : ''}
                `}>
                    <div className="flex justify-between items-start mb-1">
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className={`font-bold ${compact ? 'text-sm' : 'text-base'} ${isNext ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                    {station.station_name}
                                </h4>
                                {isNext && <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>}
                            </div>
                            <p className="text-xs font-mono text-slate-400 mt-0.5">{station.station_code} • {station.distance_from_source}km</p>
                        </div>
                        
                        <div className="text-right flex flex-col items-end">
                             <div className={`text-xs font-bold px-2 py-1 rounded-md mb-1 ${
                                 station.arrival_delay > 0 
                                 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                                 : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                             }`}>
                                {station.eta}
                             </div>
                             {!compact && <span className="text-[10px] text-slate-400">Exp. Arrival</span>}
                        </div>
                    </div>
                    
                    {!compact && (
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                             <div className="text-center md:text-left">
                                <span className="block text-[10px] uppercase text-slate-400 font-semibold">Sch.</span>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{station.sta}</span>
                             </div>
                             <div className="text-center md:text-left">
                                <span className="block text-[10px] uppercase text-slate-400 font-semibold">Halt</span>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{station.halt === 0 ? '--' : `${station.halt}m`}</span>
                             </div>
                             <div className="text-center md:text-left">
                                <span className="block text-[10px] uppercase text-slate-400 font-semibold">Plat.</span>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{station.platform_number || 'TBA'}</span>
                             </div>
                        </div>
                    )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;