import React, { useRef, useEffect, useState, useMemo } from 'react';
import { TrainData, Station } from '../types';
import { TrainFrontTunnel, MapPin, ChevronRight, Clock, Building2 } from 'lucide-react';

interface TimelineProps {
  data: TrainData;
  compact: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ data, compact }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasScrolledInitial, setHasScrolledInitial] = useState(false);

  // Combine and sort stations based on distance to ensure correct order
  const allStations = useMemo(() => {
    // Merge arrays
    const rawStations = [...data.previous_stations, ...data.upcoming_stations];
    
    // Sort by distance from source
    const sorted = rawStations.sort((a, b) => a.distance_from_source - b.distance_from_source);
    
    // Filter duplicates just in case
    return sorted.filter((station, index, self) => 
      index === self.findIndex((t) => (
        t.station_code === station.station_code
      ))
    );
  }, [data]);

  // Constants for visual layout
  const STATION_WIDTH = compact ? 130 : 160; // Increased slightly for wider cards
  const START_PADDING = 60; 

  // Calculate Train Position
  const trainPosition = useMemo(() => {
    const currentDist = data.distance_from_source;
    
    // Find the station index immediately before or at the train's location
    let prevStationIndex = -1;
    for (let i = 0; i < allStations.length; i++) {
        if (allStations[i].distance_from_source <= currentDist) {
            prevStationIndex = i;
        } else {
            break;
        }
    }

    // If train hasn't started
    if (prevStationIndex === -1) return START_PADDING;

    // If train is past the last station
    if (prevStationIndex >= allStations.length - 1) {
        return START_PADDING + (allStations.length - 1) * STATION_WIDTH;
    }

    const prevStation = allStations[prevStationIndex];
    const nextStation = allStations[prevStationIndex + 1];

    const distDiff = nextStation.distance_from_source - prevStation.distance_from_source;
    
    // Avoid division by zero
    const progress = distDiff > 0 
        ? (currentDist - prevStation.distance_from_source) / distDiff 
        : 0;
    
    // Calculate pixel position
    return START_PADDING + (prevStationIndex * STATION_WIDTH) + (progress * STATION_WIDTH);

  }, [data, allStations, STATION_WIDTH]);


  // Auto-scroll to train position on load
  useEffect(() => {
    if (scrollContainerRef.current && trainPosition > 0 && !hasScrolledInitial) {
        const containerWidth = scrollContainerRef.current.clientWidth;
        // Center the train
        const scrollPos = trainPosition - (containerWidth / 2);
        
        scrollContainerRef.current.scrollTo({
            left: Math.max(0, scrollPos),
            behavior: 'smooth'
        });
        setHasScrolledInitial(true);
    }
  }, [trainPosition, hasScrolledInitial]);

  // If train number changes, reset scroll
  useEffect(() => {
    setHasScrolledInitial(false);
  }, [data.train_number]);

  return (
    <div className="h-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col transition-all duration-300 min-h-[200px]">
      
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex justify-between items-center z-10">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <MapPin size={16} className="text-indigo-500" />
          Live Route
        </h3>
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-slate-500 font-medium">
             <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  <span>Passed</span>
              </div>
              <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full border border-slate-400 bg-white dark:bg-slate-800"></div>
                  <span>Upcoming</span>
              </div>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 relative overflow-x-auto overflow-y-hidden custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50 scroll-smooth select-none"
      >
        <div 
            className="relative h-full flex items-center"
            style={{ 
                width: `${allStations.length * STATION_WIDTH + 120}px`,
                paddingLeft: `${START_PADDING}px` 
            }}
        >
            {/* The Track (Chain) */}
            <div className="absolute left-0 right-0 h-2 top-1/2 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 mx-4 rounded-full overflow-hidden">
                {/* Progress Fill */}
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-400 transition-all duration-1000 ease-linear"
                    style={{ width: `${trainPosition}px` }}
                ></div>
            </div>

            {/* Stations (Nodes) */}
            {allStations.map((station, index) => {
                const isPassed = index * STATION_WIDTH + START_PADDING < trainPosition;
                
                return (
                    <div 
                        key={station.station_code}
                        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center group"
                        style={{ left: `${START_PADDING + index * STATION_WIDTH}px` }}
                    >
                        {/* Station Node Point */}
                        <div className={`
                            relative z-10 h-4 w-4 rounded-full border-[3px] transition-all duration-300
                            ${isPassed 
                                ? 'bg-indigo-600 border-indigo-100 dark:border-indigo-900 scale-100' 
                                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 scale-90'
                            }
                            group-hover:scale-125 group-hover:border-indigo-400
                        `}>
                        </div>

                        {/* Connection Dot Overlay for cleaner look */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-transparent z-20 cursor-pointer" title={station.station_name}></div>

                        {/* Station Card (Alternating Top/Bottom) */}
                        <div className={`
                            absolute w-32 flex flex-col items-center text-center transition-all duration-300 z-20
                            ${index % 2 === 0 ? '-top-28 justify-end pb-5' : '-bottom-28 justify-start pt-5'}
                            ${isPassed ? 'opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0' : 'opacity-100'}
                        `}>
                            {/* Connecting Line to Node */}
                            <div className={`
                                absolute left-1/2 -translate-x-1/2 w-[1px] bg-slate-300 dark:bg-slate-700
                                ${index % 2 === 0 ? 'top-full h-5' : 'bottom-full h-5'}
                            `}></div>

                            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 w-full hover:shadow-md hover:scale-105 transition-all duration-200 text-left">
                                <div className="flex justify-between items-start mb-1.5">
                                    <h4 className="text-[10px] font-bold text-slate-800 dark:text-white truncate w-16 leading-tight" title={station.station_name}>
                                        {station.station_name}
                                    </h4>
                                    <div className="text-[9px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-1 rounded">
                                         {station.station_code}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/50">
                                    <div>
                                        <span className="text-[8px] text-slate-400 uppercase block tracking-wider">Arr</span>
                                        <span className={`text-[10px] font-bold leading-tight ${station.arrival_delay > 0 ? "text-amber-600 dark:text-amber-500" : "text-slate-700 dark:text-slate-300"}`}>
                                            {station.eta || '--:--'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                         <span className="text-[8px] text-slate-400 uppercase block tracking-wider">Dep</span>
                                         <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                                            {station.etd || '--:--'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="mt-1.5 pt-1 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                                     <span className="text-[8px] text-slate-400">{station.distance_from_source} km</span>
                                     {station.halt > 0 && <span className="text-[8px] text-indigo-500 font-medium">{station.halt}m Halt</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* The Animated Train Model */}
            <div 
                className="absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-[2000ms] ease-linear will-change-transform"
                style={{ 
                    left: `${trainPosition}px`,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                {/* Train Container */}
                <div className="relative">
                    {/* Ripple Effect */}
                    <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
                    
                    {/* Train Icon Wrapper */}
                    <div className="relative h-8 w-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full shadow-lg shadow-indigo-500/40 border-2 border-white dark:border-slate-800 flex items-center justify-center transform hover:scale-110 transition-transform cursor-grab active:cursor-grabbing">
                        <TrainFrontTunnel size={14} className="text-white" />
                    </div>

                    {/* Tooltip: Current status */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap">
                        {data.delay > 0 ? `+${data.delay} min` : 'On Time'}
                         <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 border-l-3 border-l-transparent border-r-3 border-r-transparent border-t-3 border-t-slate-900"></div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Timeline;