import { differenceInMinutes, parseISO, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentMetrics, SeatEntry, CampLeads } from '../types';

// Get all agents from localStorage
export const getAgents = (): Agent[] => {
  const agentsJSON = localStorage.getItem('agents');
  return agentsJSON ? JSON.parse(agentsJSON) : [];
};

// Save agents to localStorage
export const saveAgents = (agents: Agent[]): void => {
  localStorage.setItem('agents', JSON.stringify(agents));
};

// Add a new agent
export const addAgent = (agent: Omit<Agent, 'id' | 'seats' | 'isActive' | 'adherence' | 'conformance' | 'leadsByCamp' | 'manualLoggedTime' | 'shiftActualEnd'>): Agent => {
  const agents = getAgents();
  const newAgent: Agent = {
    id: uuidv4(),
    ...agent,
    seats: [],
    isActive: false,
    adherence: null,
    conformance: null,
    leadsByCamp: [],
    manualLoggedTime: null,
    shiftActualEnd: null
  };
  
  agents.push(newAgent);
  saveAgents(agents);
  return newAgent;
};

// Update an agent
export const updateAgent = (updatedAgent: Agent): void => {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === updatedAgent.id);
  
  if (index >= 0) {
    agents[index] = updatedAgent;
    saveAgents(agents);
  }
};

// Delete an agent
export const deleteAgent = (agentId: string): void => {
  const agents = getAgents().filter(a => a.id !== agentId);
  saveAgents(agents);
};

// Start agent shift
export const startAgentShift = (agentId: string, seatName: string): void => {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === agentId);
  
  if (index >= 0) {
    const now = new Date().toISOString();
    
    // Start shift
    agents[index].shiftActualStart = now;
    agents[index].isActive = true;
    
    // Add first seat
    const newSeat: SeatEntry = {
      id: uuidv4(),
      seatName,
      startTime: now,
      endTime: null,
      wrapUpTime: 0,
    };
    
    agents[index].seats.push(newSeat);
    saveAgents(agents);
  }
};

// End agent shift
export const endAgentShift = (agentId: string, endTime: string): void => {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === agentId);
  
  if (index >= 0 && agents[index].isActive) {
    // End current seat if any is active
    const currentSeatIndex = agents[index].seats.findIndex(seat => !seat.endTime);
    if (currentSeatIndex >= 0) {
      agents[index].seats[currentSeatIndex].endTime = endTime;
    }
    
    agents[index].shiftActualEnd = endTime;
    agents[index].isActive = false;
    saveAgents(agents);
  }
};

// Add a new seat for an agent (seat shuffling)
export const addAgentSeat = (agentId: string, seatName: string, wrapUpTimeForPrevious: number): void => {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === agentId);
  
  if (index >= 0 && agents[index].isActive) {
    const now = new Date().toISOString();
    
    // End current seat if any is active
    const currentSeatIndex = agents[index].seats.findIndex(seat => !seat.endTime);
    if (currentSeatIndex >= 0) {
      agents[index].seats[currentSeatIndex].endTime = now;
      agents[index].seats[currentSeatIndex].wrapUpTime = wrapUpTimeForPrevious;
    }
    
    // Add new seat
    const newSeat: SeatEntry = {
      id: uuidv4(),
      seatName,
      startTime: agents[index].shiftActualStart || now,
      endTime: null,
      wrapUpTime: 0,
    };
    
    agents[index].seats.push(newSeat);
    saveAgents(agents);
  }
};

// Update wrap-up time for a seat
export const updateSeatWrapUpTime = (agentId: string, seatId: string, wrapUpTime: number): void => {
  const agents = getAgents();
  const agentIndex = agents.findIndex(a => a.id === agentId);
  
  if (agentIndex >= 0) {
    const seatIndex = agents[agentIndex].seats.findIndex(s => s.id === seatId);
    
    if (seatIndex >= 0) {
      agents[agentIndex].seats[seatIndex].wrapUpTime = wrapUpTime;
      saveAgents(agents);
    }
  }
};

// Update agent leads with camp
export const updateAgentLeads = (agentId: string, leads: number, campName: string): void => {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === agentId);
  
  if (index >= 0) {
    // Update total leads
    agents[index].leads = leads;
    
    // Update leads by camp
    const campIndex = agents[index].leadsByCamp.findIndex(c => c.campName === campName);
    if (campIndex >= 0) {
      agents[index].leadsByCamp[campIndex].leads = leads;
    } else {
      agents[index].leadsByCamp.push({ campName, leads });
    }
    
    saveAgents(agents);
  }
};

// Calculate all metrics for an agent
export const calculateAgentMetrics = (agent: Agent): AgentMetrics => {
  // Calculate lateness
  let lateness = 0;
  if (agent.shiftActualStart && agent.shiftScheduledStart) {
    const scheduledStart = parseISO(agent.shiftScheduledStart);
    const actualStart = parseISO(agent.shiftActualStart);
    lateness = Math.max(0, differenceInMinutes(actualStart, scheduledStart));
  }
  
  // Calculate logged time based on manual input or actual times
  let loggedTime = 0;
  if (agent.manualLoggedTime !== null) {
    loggedTime = agent.manualLoggedTime;
  } else if (agent.shiftActualStart) {
    const actualStart = parseISO(agent.shiftActualStart);
    const endTime = agent.shiftActualEnd ? parseISO(agent.shiftActualEnd) : new Date();
    loggedTime = differenceInMinutes(endTime, actualStart);
  }
  
  // Calculate total wrap-up time
  const totalWrapUpTime = agent.seats.reduce((sum, seat) => sum + seat.wrapUpTime, 0);
  
  // Calculate adherence and conformance
  let adherence = 0;
  let conformance = 0;
  let productivity = 0;
  
  if (agent.shiftScheduledStart && agent.shiftScheduledEnd) {
    const scheduledStart = parseISO(agent.shiftScheduledStart);
    const scheduledEnd = parseISO(agent.shiftScheduledEnd);
    const scheduledDuration = differenceInMinutes(scheduledEnd, scheduledStart);
    
    // Adherence: Percentage of time an agent is working as scheduled
    adherence = Math.min(100, Math.round((loggedTime / scheduledDuration) * 100));
    
    // Conformance: Percentage of scheduled slots filled correctly
    const startTimeAdherence = lateness <= 5 ? 100 : Math.max(0, 100 - (lateness / 5));
    const timeSpentAdherence = Math.min(100, Math.round((loggedTime / scheduledDuration) * 100));
    conformance = Math.round((startTimeAdherence + timeSpentAdherence) / 2);
    
    // Productivity: Leads per hour
    const loggedHours = loggedTime / 60;
    productivity = loggedHours > 0 ? (agent.leads / loggedHours) * 100 : 0;
  }
  
  return {
    lateness,
    loggedTime,
    totalWrapUpTime,
    adherence,
    conformance,
    productivity
  };
};

// Format time in HH:MM format
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}`;
};

// Format time in hours and minutes
export const formatTimeHoursMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Format date in readable format
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
};

// Get ranked agents by leads
export const getRankedAgentsByLeads = (): Agent[] => {
  return getAgents().sort((a, b) => b.leads - a.leads);
};

// Update agent start time
export const updateAgentStartTime = (agentId: string, newStartTime: string): void => {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === agentId);
  
  if (index >= 0) {
    agents[index].shiftActualStart = newStartTime;
    
    // Update first seat start time if exists
    if (agents[index].seats.length > 0) {
      agents[index].seats[0].startTime = newStartTime;
    }
    
    saveAgents(agents);
  }
};

// Update agent manual logged time
export const updateAgentManualLoggedTime = (agentId: string, loggedTime: number): void => {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === agentId);
  
  if (index >= 0) {
    agents[index].manualLoggedTime = loggedTime;
    saveAgents(agents);
  }
};

// Calculate productivity (leads per hour)
export const calculateProductivity = (agent: Agent): number => {
  const metrics = calculateAgentMetrics(agent);
  return metrics.productivity;
};

// Delete a seat
export const deleteSeat = (agentId: string, seatId: string): void => {
  const agents = getAgents();
  const agentIndex = agents.findIndex(a => a.id === agentId);
  
  if (agentIndex >= 0) {
    agents[agentIndex].seats = agents[agentIndex].seats.filter(s => s.id !== seatId);
    saveAgents(agents);
  }
};

// Update seat details
export const updateSeat = (agentId: string, updatedSeat: SeatEntry): void => {
  const agents = getAgents();
  const agentIndex = agents.findIndex(a => a.id === agentId);
  
  if (agentIndex >= 0) {
    const seatIndex = agents[agentIndex].seats.findIndex(s => s.id === updatedSeat.id);
    if (seatIndex >= 0) {
      agents[agentIndex].seats[seatIndex] = updatedSeat;
      saveAgents(agents);
    }
  }
};