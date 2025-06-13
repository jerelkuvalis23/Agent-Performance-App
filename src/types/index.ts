export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'viewer';
}

export interface Agent {
  id: string;
  name: string;
  shiftScheduledStart: string; // ISO string
  shiftScheduledEnd: string; // ISO string
  shiftActualStart: string | null; // ISO string
  shiftActualEnd: string | null; // ISO string
  manualLoggedTime: number | null; // in minutes
  isActive: boolean;
  seats: SeatEntry[];
  leads: number;
  adherence: number | null;
  conformance: number | null;
  notes?: string;
  leadsByCamp: CampLeads[];
}

export interface SeatEntry {
  id: string;
  seatName: string;
  startTime: string; // ISO string
  endTime: string | null; // ISO string
  wrapUpTime: number; // in minutes
  previousCamp?: string;
  newCamp?: string;
}

export interface CampLeads {
  campName: string;
  leads: number;
}

export interface Camp {
  id: string;
  name: string;
  target: number;
  leads: number;
  status: 'in_progress' | 'achieved' | 'not_achieved';
}

export interface AgentMetrics {
  lateness: number; // in minutes
  loggedTime: number; // in minutes
  totalWrapUpTime: number; // in minutes
  adherence: number; // percentage
  conformance: number; // percentage
  productivity: number; // percentage
}

export interface AppSettings {
  darkMode: boolean;
  updateInterval: number; // in seconds
  theme: {
    primary: string;
    secondary: string;
  };
}

export interface Report {
  id: string;
  name: string;
  date: string;
  type: 'daily' | 'weekly' | 'monthly';
  data: any;
}