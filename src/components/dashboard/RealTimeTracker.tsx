import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Agent, AgentMetrics } from '../../types';
import { calculateAgentMetrics, formatTime } from '../../utils/agentUtils';
import { getSettings } from '../../utils/settingsUtils';

interface RealTimeTrackerProps {
  agents: Agent[];
}

const RealTimeTracker: React.FC<RealTimeTrackerProps> = ({ agents }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [agentMetrics, setAgentMetrics] = useState<Map<string, AgentMetrics>>(new Map());
  
  // Update time and metrics
  useEffect(() => {
    const updateTimeAndMetrics = () => {
      // Update current time
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      
      // Update agent metrics
      const metrics = new Map<string, AgentMetrics>();
      agents.forEach(agent => {
        metrics.set(agent.id, calculateAgentMetrics(agent));
      });
      setAgentMetrics(metrics);
    };
    
    // Initial update
    updateTimeAndMetrics();
    
    // Set interval for updates
    const settings = getSettings();
    const interval = setInterval(updateTimeAndMetrics, settings.updateInterval * 1000);
    
    return () => clearInterval(interval);
  }, [agents]);
  
  // Filter only active agents
  const activeAgents = agents.filter(agent => agent.isActive);
  
  if (activeAgents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-gray-500 dark:text-gray-400">
        <Clock className="w-8 h-8 mb-2" />
        <p>No agents currently active</p>
        <p className="text-sm">Start an agent's shift to see real-time tracking</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span>Last updated: {currentTime}</span>
        </div>
        <div className="text-sm text-primary-600 dark:text-primary-400">
          <Clock className="w-4 h-4 inline mr-1" /> Auto-refreshes every minute
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Shift Scheduled
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Shift Start
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Lateness
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Adherence
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Conformance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Logged Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Wrap-up Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Current Seat
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {activeAgents.map(agent => {
              const metrics = agentMetrics.get(agent.id);
              const currentSeat = agent.seats.find(seat => !seat.endTime);
              
              return (
                <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {agent.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(agent.shiftScheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {agent.shiftActualStart ? 
                      new Date(agent.shiftActualStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                      '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`${
                      metrics && metrics.lateness > 10 
                        ? 'text-red-600 dark:text-red-400' 
                        : metrics && metrics.lateness > 5 
                          ? 'text-yellow-600 dark:text-yellow-400' 
                          : 'text-green-600 dark:text-green-400'
                    }`}>
                      {metrics ? `${metrics.lateness} min` : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`${
                      metrics && metrics.adherence < 70 
                        ? 'text-red-600 dark:text-red-400' 
                        : metrics && metrics.adherence < 90 
                          ? 'text-yellow-600 dark:text-yellow-400' 
                          : 'text-green-600 dark:text-green-400'
                    }`}>
                      {metrics ? `${metrics.adherence}%` : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`${
                      metrics && metrics.conformance < 70 
                        ? 'text-red-600 dark:text-red-400' 
                        : metrics && metrics.conformance < 90 
                          ? 'text-yellow-600 dark:text-yellow-400' 
                          : 'text-green-600 dark:text-green-400'
                    }`}>
                      {metrics ? `${metrics.conformance}%` : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {metrics ? formatTime(metrics.loggedTime) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {metrics ? `${metrics.totalWrapUpTime} min` : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {currentSeat ? currentSeat.seatName : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RealTimeTracker;