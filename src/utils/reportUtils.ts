import { format } from 'date-fns';
import { Report } from '../types';
import { getAgents } from './agentUtils';
import { calculateAgentMetrics } from './agentUtils';

// Update the time formatting in reports
export const formatReportTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Get all reports
export const getReports = (): Report[] => {
  // Retrieve reports from localStorage
  const reportsJson = localStorage.getItem('reports') || '[]';
  return JSON.parse(reportsJson);
};

// Save a report
export const saveReport = (report: Report): void => {
  const reports = getReports();
  reports.push(report);
  localStorage.setItem('reports', JSON.stringify(reports));
};

// Delete a report
export const deleteReport = (id: string): void => {
  const reports = getReports();
  const updatedReports = reports.filter(report => report.id !== id);
  localStorage.setItem('reports', JSON.stringify(updatedReports));
};

// Export report to Excel
export const exportToExcel = (report: Report): void => {
  // Implementation for Excel export
  console.log('Exporting report to Excel:', report);
};

// Update the report generation functions to use the new format
export const generateDailyReport = (): Report => {
  const agents = getAgents();
  const today = new Date();
  
  const data = agents.map(agent => {
    const metrics = calculateAgentMetrics(agent);
    return {
      name: agent.name,
      lateness: metrics.lateness,
      adherence: metrics.adherence,
      conformance: metrics.conformance,
      loggedTime: formatReportTime(metrics.loggedTime),
      wrapUpTime: formatReportTime(metrics.totalWrapUpTime),
      leads: agent.leads,
      productivity: `${metrics.productivity.toFixed(1)}%`
    };
  });
  
  return {
    id: `daily-${today.getTime()}`,
    name: `Daily Report - ${format(today, 'yyyy-MM-dd')}`,
    date: today.toISOString(),
    type: 'daily',
    data
  };
};

export const generateWeeklyReport = (): Report => {
  const agents = getAgents();
  const today = new Date();
  
  const data = agents.map(agent => {
    const metrics = calculateAgentMetrics(agent);
    return {
      name: agent.name,
      lateness: metrics.lateness,
      adherence: metrics.adherence,
      conformance: metrics.conformance,
      loggedTime: formatReportTime(metrics.loggedTime),
      wrapUpTime: formatReportTime(metrics.totalWrapUpTime),
      leads: agent.leads,
      productivity: `${metrics.productivity.toFixed(1)}%`
    };
  });
  
  return {
    id: `weekly-${today.getTime()}`,
    name: `Weekly Report - ${format(today, 'yyyy-MM-dd')}`,
    date: today.toISOString(),
    type: 'weekly',
    data
  };
};

export const generateMonthlyReport = (): Report => {
  const agents = getAgents();
  const today = new Date();
  
  const data = agents.map(agent => {
    const metrics = calculateAgentMetrics(agent);
    return {
      name: agent.name,
      lateness: metrics.lateness,
      adherence: metrics.adherence,
      conformance: metrics.conformance,
      loggedTime: formatReportTime(metrics.loggedTime),
      wrapUpTime: formatReportTime(metrics.totalWrapUpTime),
      leads: agent.leads,
      productivity: `${metrics.productivity.toFixed(1)}%`
    };
  });
  
  return {
    id: `monthly-${today.getTime()}`,
    name: `Monthly Report - ${format(today, 'yyyy-MM-dd')}`,
    date: today.toISOString(),
    type: 'monthly',
    data
  };
};