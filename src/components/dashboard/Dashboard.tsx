import React, { useState, useEffect } from 'react';
import { TrendingUp, Target } from 'lucide-react';

// Update the performance rankings section
const Dashboard = () => {
  const [averageProductivity, setAverageProductivity] = useState(0);

  // Mock data for demonstration - replace with actual data
  const [agents] = useState([
    { id: 1, name: 'Agent Smith', isActive: true, leads: 25 },
    { id: 2, name: 'Agent Johnson', isActive: true, leads: 18 },
    { id: 3, name: 'Agent Williams', isActive: true, leads: 22 },
    { id: 4, name: 'Agent Brown', isActive: false, leads: 15 },
    { id: 5, name: 'Agent Davis', isActive: true, leads: 20 }
  ]);

  const calculateAgentMetrics = (agent: any) => {
    // Mock calculation - replace with actual logic
    return {
      productivity: Math.min(100, (agent.leads / 30) * 100)
    };
  };

  const topPerformers = agents
    .filter(agent => agent.isActive)
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 3);

  useEffect(() => {
    // Calculate average productivity
    const activeAgents = agents.filter(agent => agent.isActive);
    if (activeAgents.length > 0) {
      const totalProductivity = activeAgents.reduce((sum, agent) => {
        const metrics = calculateAgentMetrics(agent);
        return sum + metrics.productivity;
      }, 0);
      setAverageProductivity(totalProductivity / activeAgents.length);
    }
  }, [agents]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top Performers</h2>
          </div>
          <div className="space-y-3">
            {topPerformers.map((agent, index) => {
              const metrics = calculateAgentMetrics(agent);
              return (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="ml-3 font-medium text-gray-900 dark:text-white">{agent.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{agent.leads} leads</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{metrics.productivity.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Average Productivity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Productivity</h2>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {averageProductivity.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Average Team Productivity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;