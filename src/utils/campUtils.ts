import { v4 as uuidv4 } from 'uuid';
import { Camp } from '../types';

// Get all camps from localStorage
export const getCamps = (): Camp[] => {
  const campsJSON = localStorage.getItem('camps');
  return campsJSON ? JSON.parse(campsJSON) : [];
};

// Save camps to localStorage
export const saveCamps = (camps: Camp[]): void => {
  localStorage.setItem('camps', JSON.stringify(camps));
};

// Add a new camp
export const addCamp = (name: string, target: number): Camp => {
  const camps = getCamps();
  const newCamp: Camp = {
    id: uuidv4(),
    name,
    target,
    leads: 0,
    status: 'in_progress'
  };
  
  camps.push(newCamp);
  saveCamps(camps);
  return newCamp;
};

// Update camp leads and status
export const updateCampLeads = (campName: string, leads: number): void => {
  const camps = getCamps();
  const campIndex = camps.findIndex(c => c.name === campName);
  
  if (campIndex >= 0) {
    camps[campIndex].leads = leads;
    
    // Update status
    if (leads >= camps[campIndex].target) {
      camps[campIndex].status = 'achieved';
    } else {
      const activeAgents = JSON.parse(localStorage.getItem('agents') || '[]')
        .filter((agent: any) => agent.isActive);
      
      camps[campIndex].status = activeAgents.length > 0 ? 'in_progress' : 'not_achieved';
    }
    
    saveCamps(camps);
  }
};

// Calculate camp productivity
export const calculateCampProductivity = (camp: Camp): number => {
  if (camp.target === 0) return 0;
  return (camp.leads / camp.target) * 100;
};

// Calculate overall team productivity
export const calculateOverallProductivity = (): number => {
  const camps = getCamps();
  if (camps.length === 0) return 0;
  
  const totalLeads = camps.reduce((sum, camp) => sum + camp.leads, 0);
  const totalTargets = camps.reduce((sum, camp) => sum + camp.target, 0);
  
  return totalTargets > 0 ? (totalLeads / totalTargets) * 100 : 0;
};