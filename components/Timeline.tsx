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
  // RailYatri API usually gives them separated, we merge to create the full "Level Map"
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
  const STATION_WIDTH = compact ? 140 : 180;
  const START_PADDING = 50; // Padding at start of track

  // Calculate Train Position
  // We use distance to interpolate position between stations
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
    // Index * Width + (Percentage * Width) + Padding
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
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col transition-all duration-300">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex justify-between items-center z-10">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <MapPin size={20} className="text-indigo-500" />
          Live Route
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-500">
           <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
           <span>Live Update</span>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="relative h-[320px] overflow-x-auto overflow-y-hidden custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50 scroll-smooth select-none"
      >
        <div 
            className="relative h-full flex items-center"
            style={{ 
                width: `${allStations.length * STATION_WIDTH + 100}px`,
                paddingLeft: `${START_PADDING}px` 
            }}
        >
            {/* The Track (Chain) */}
            <div className="absolute left-0 right-0 h-3 top-1/2 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 mx-4 rounded-full overflow-hidden">
                {/* Progress Fill */}
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-400 transition-all duration-1000 ease-linear"
                    style={{ width: `${trainPosition}px` }}
                ></div>
            </div>

            {/* Stations (Nodes) */}
            {allStations.map((station, index) => {
                const isPassed = index * STATION_WIDTH + START_PADDING < trainPosition;
                const isNext = !isPassed && (index * STATION_WIDTH + START_PADDING) > trainPosition && (index === 0 || (index > 0 && ((index-1) * STATION_WIDTH + START_PADDING) <= trainPosition));

                return (
                    <div 
                        key={station.station_code}
                        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center group"
                        style={{ left: `${START_PADDING + index * STATION_WIDTH}px` }}
                    >
                        {/* Station Node Point */}
                        <div className={`
                            relative z-10 h-6 w-6 rounded-full border-4 transition-all duration-300
                            ${isPassed 
                                ? 'bg-indigo-600 border-indigo-100 dark:border-indigo-900 scale-100' 
                                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 scale-90'
                            }
                            group-hover:scale-125 group-hover:border-indigo-400
                        `}>
                            {isPassed && (
                                <div className="absolute inset-0 bg-indigo-600 rounded-full"></div>
                            )}
                        </div>

                        {/* Connection Dot Overlay for cleaner look */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 bg-transparent z-20 cursor-pointer" title={station.station_name}></div>

                        {/* Station Card (Alternating Top/Bottom) */}
                        <div className={`
                            absolute w-32 flex flex-col items-center text-center transition-all duration-300
                            ${index % 2 === 0 ? '-top-32 justify-end pb-4' : '-bottom-32 justify-start pt-4'}
                            ${isPassed ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0' : 'opacity-100'}
                        `}>
                            {/* Connecting Line to Node */}
                            <div className={`
                                absolute left-1/2 -translate-x-1/2 w-0.5 bg-slate-300 dark:bg-slate-700
                                ${index % 2 === 0 ? 'top-full h-4' : 'bottom-full h-4'}
                            `}></div>

                            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 w-full hover:scale-105 transition-transform duration-200">
                                <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate w-full" title={station.station_name}>
                                    {station.station_name}
                                </h4>
                                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 mt-1 font-mono bg-slate-100 dark:bg-slate-700/50 rounded px-1.5 py-0.5">
                                    <span>{station.station_code}</span>
                                </div>
                                <div className="mt-2 flex justify-between items-center text-[10px] w-full border-t border-slate-100 dark:border-slate-700 pt-1.5">
                                    <span className={station.arrival_delay > 0 ? "text-amber-600 font-bold" : "text-emerald-600 font-bold"}>
                                        {station.eta}
                                    </span>
                                    <span className="text-slate-400">{station.distance_from_source}km</span>
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
                    <div className="relative h-12 w-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full shadow-xl shadow-indigo-500/40 border-2 border-white dark:border-slate-800 flex items-center justify-center transform rotate-0 hover:scale-110 transition-transform cursor-grab active:cursor-grabbing">
                        <TrainFrontTunnel size={24} className="text-white drop-shadow-md" />
                    </div>

                    {/* Tooltip: Current status */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                        {data.delay > 0 ? `Delayed ${data.delay}m` : 'On Time'}
                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-900"></div>
                    </div>
                </div>
            </div>

        </div>
      </div>
      
      {/* Legend / Info Footer */}
      <div className="bg-slate-50 dark:bg-slate-900/80 px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  <span>Passed</span>
              </div>
              <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full border border-slate-400 bg-white dark:bg-slate-800"></div>
                  <span>Upcoming</span>
              </div>
          </div>
          <div className="hidden sm:block">
              Scroll to view full route
          </div>
      </div>
    </div>
  );
};

export default Timeline;