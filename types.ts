export interface Station {
  si_no: number;
  station_code: string;
  station_name: string;
  distance_from_source: number;
  sta: string; // Scheduled Arrival
  std: string; // Scheduled Departure
  eta: string; // Estimated Arrival
  etd: string; // Estimated Departure
  halt: number;
  arrival_delay: number;
  platform_number: number;
  on_time_rating?: number;
  station_lat?: number;
  station_lng?: number;
  day?: number;
  distance_from_current_station_txt?: string;
}

export interface TrainData {
  success: boolean;
  train_number: string;
  train_name: string;
  train_start_date: string;
  source_stn_name: string;
  dest_stn_name: string;
  run_days: string;
  current_station_name: string;
  current_station_code: string;
  status: string; // "T" etc
  delay: number; // in minutes
  distance_from_source: number;
  total_distance: number;
  eta: string;
  etd: string;
  update_time: string;
  travelling_towards: string;
  ahead_distance_text: string;
  previous_stations: Station[];
  upcoming_stations: Station[];
  next_stoppage_info?: {
    next_stoppage: string;
    next_stoppage_time_diff: string;
  };
}