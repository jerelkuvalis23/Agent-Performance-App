import React, { useState, useEffect } from 'react';
import { 
  FileBarChart, 
  Download, 
  Plus, 
  Calendar, 
  Trash2, 
  BarChart4, 
  LineChart 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import { 
  generateDailyReport, 
  generateWeeklyReport, 
  generateMonthlyReport, 
  saveReport, 
  getReports, 
  deleteReport,
  exportToExcel
} from '../../utils/reportUtils';
import { Report } from '../../types';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  useEffect(() => {
    loadReports();
  }, []);
  
  const loadReports = () => {
    const allReports = getReports();
    setReports(allReports);
  };
  
  const handleCreateReport = () => {
    let newReport: Report;
    
    switch (reportType) {
      case 'daily':
        newReport = generateDailyReport();
        break;
      case 'weekly':
        newReport = generateWeeklyReport();
        break;
      case 'monthly':
        newReport = generateMonthlyReport();
        break;
      default:
        newReport = generateDailyReport();
    }
    
    saveReport(newReport);
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report created successfully`);
    loadReports();
  };
  
  const handleDeleteReport = (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      deleteReport(id);
      
      if (selectedReport && selectedReport.id === id) {
        setSelectedReport(null);
      }
      
      toast.success('Report deleted successfully');
      loadReports();
    }
  };
  
  const handleExportToExcel = (report: Report) => {
    exportToExcel(report);
    toast.success('Report exported to Excel successfully');
  };
  
  // Prepare chart data if a report is selected
  const prepareChartData = () => {
    if (!selectedReport) return null;
    
    const labels = selectedReport.data.map((item: any) => item.name);
    const adherenceData = selectedReport.data.map((item: any) => item.adherence);
    const conformanceData = selectedReport.data.map((item: any) => item.conformance);
    const loggedTimeData = selectedReport.data.map((item: any) => item.loggedTime);
    const wrapUpTimeData = selectedReport.data.map((item: any) => item.wrapUpTime);
    const leadsData = selectedReport.data.map((item: any) => item.leads);
    
    return {
      labels,
      adherenceData,
      conformanceData,
      loggedTimeData,
      wrapUpTimeData,
      leadsData
    };
  };
  
  const chartData = prepareChartData();
  
  const performanceChartData = chartData ? {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Adherence',
        data: chartData.adherenceData,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Conformance',
        data: chartData.conformanceData,
        backgroundColor: 'rgba(20, 184, 166, 0.8)',
        borderColor: 'rgba(20, 184, 166, 1)',
        borderWidth: 1,
      },
    ],
  } : null;
  
  const timeChartData = chartData ? {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Logged Time (minutes)',
        data: chartData.loggedTimeData,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Wrap-up Time (minutes)',
        data: chartData.wrapUpTimeData,
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
      },
    ],
  } : null;
  
  const leadsChartData = chartData ? {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Leads',
        data: chartData.leadsData,
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 1,
      },
    ],
  } : null;
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Reports</h1>
            <p className="text-gray-500 dark:text-gray-400">Generate and analyze performance reports</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
            </select>
            
            <button
              onClick={handleCreateReport}
              className="inline-flex items-center px-4 py-2 border border-transparent 
                        rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Report List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileBarChart className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                Saved Reports
              </h2>
              
              {reports.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reports yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Generate your first report to see it here
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {reports.map((report) => (
                    <div 
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedReport?.id === report.id
                          ? 'bg-primary-100 dark:bg-primary-900/30 border-l-4 border-primary-500'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm">{report.name}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReport(report.id);
                          }}
                          className="text-gray-400 hover:text-red-500 focus:outline-none"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Created: {format(parseISO(report.date), 'MMM dd, yyyy HH:mm')}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          report.type === 'daily'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : report.type === 'weekly'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        }`}>
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportToExcel(report);
                          }}
                          className="ml-auto text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
                          title="Export to Excel"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Report Visualization */}
          <div className="lg:col-span-3">
            {selectedReport ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedReport.name}</h2>
                  <button
                    onClick={() => handleExportToExcel(selectedReport)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 
                              rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 
                              bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export to Excel
                  </button>
                </div>
                
                {/* Performance Chart */}
                <div>
                  <div className="flex items-center mb-3">
                    <BarChart4 className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">Adherence & Conformance</h3>
                  </div>
                  <div className="h-64">
                    {performanceChartData && (
                      <Bar 
                        data={performanceChartData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              ticks: {
                                callback: (value) => `${value}%`,
                              },
                            },
                          },
                        }}
                      />
                    )}
                  </div>
                </div>
                
                {/* Time Chart */}
                <div>
                  <div className="flex items-center mb-3">
                    <LineChart className="w-5 h-5 mr-2 text-secondary-600 dark:text-secondary-400" />
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">Time Tracking</h3>
                  </div>
                  <div className="h-64">
                    {timeChartData && (
                      <Bar 
                        data={timeChartData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    )}
                  </div>
                </div>
                
                {/* Leads Chart */}
                <div>
                  <div className="flex items-center mb-3">
                    <BarChart4 className="w-5 h-5 mr-2 text-accent-600 dark:text-accent-400" />
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">Leads Comparison</h3>
                  </div>
                  <div className="h-64">
                    {leadsChartData && (
                      <Bar 
                        data={leadsChartData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    )}
                  </div>
                </div>
                
                {/* Data Table */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Detailed Data</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Agent
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Lateness
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Adherence
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Conformance
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Logged Time
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Wrap-up
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Leads
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedReport.data.map((item: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {item.lateness} min
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {item.adherence}%
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {item.conformance}%
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {item.loggedTime} min
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {item.wrapUpTime} min
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {item.leads}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 flex flex-col items-center justify-center h-full">
                <FileBarChart className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Report Selected</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Select a report from the list to view detailed analytics and visualizations
                </p>
                {reports.length === 0 && (
                  <button
                    onClick={handleCreateReport}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent 
                              rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
                              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Generate {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;