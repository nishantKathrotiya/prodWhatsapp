import React, { useState, useEffect } from 'react';
import s from './Dashboard.module.css';
import { 
  IoStatsChart, 
  IoMailSharp, 
  IoSchool, 
  IoCheckmarkDoneSharp,
  IoArrowUp, 
  IoArrowDown, 
  IoCalendarOutline,
  IoTimeOutline,
  IoSendSharp,
  IoAdd,
  IoSettings,
  IoHelpCircleOutline,
  IoRefreshOutline,
  IoSync
} from 'react-icons/io5';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Link } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalStudents: 0,
    deliveryRate: 0,
    weeklyGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastRefresh, setLastRefresh] = useState(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Mock data for dashboard stats and charts
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Function to load dashboard data
  const loadDashboardData = () => {
    setLoading(true);

    // This would be replaced with an actual API call
    setTimeout(() => {
      setStats({
        totalMessages: 2547,
        totalStudents: 876,
        deliveryRate: 98.3,
        weeklyGrowth: 12.5
      });
      setLoading(false);
      setLastRefresh(new Date());
    }, 1000);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Format time as HH:MM AM/PM
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Line chart data for usage over time
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Messages Sent',
        data: [120, 190, 210, 280, 250, 360, 410, 530, 620],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  // Line chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(75, 85, 99, 0.2)',
        borderWidth: 1,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(243, 244, 246, 0.8)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  // Bar chart data for weekly usage
  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Messages',
        data: [65, 82, 98, 75, 63, 28, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(79, 70, 229, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(129, 140, 248, 0.8)',
          'rgba(165, 180, 252, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(124, 58, 237, 0.8)'
        ],
        borderRadius: 4,
        barThickness: 20
      }
    ]
  };

  // Bar chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(75, 85, 99, 0.2)',
        borderWidth: 1,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(243, 244, 246, 0.8)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  // Show a loading overlay while data is being fetched
  if (loading) {
    return (
      <div className={s.loadingOverlay}>
        <div className={s.loadingContent}>
          <div className={s.spinner}>
            <IoRefreshOutline className={s.spinnerIcon} />
          </div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.dashboardContainer}>
      <header className={s.dashboardHeader}>
        <div className={s.welcomeSection}>
          <h1>Dashboard Overview</h1>
          <p className={s.welcomeMessage}>
            {getGreeting()}! Here's what's happening with your messaging platform today.
          </p>
        </div>
        <div className={s.headerControls}>
          {lastRefresh && (
            <div className={s.lastRefreshContainer}>
              <span className={s.lastRefreshLabel}>Last updated: {formatTime(lastRefresh)}</span>
              <button className={s.refreshButton} onClick={loadDashboardData} title="Refresh dashboard data">
                <IoSync />
              </button>
            </div>
          )}
          <div className={s.dateDisplay}>
            <IoCalendarOutline />
            <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <div className={s.statsGrid}>
        {/* Total Messages Card */}
        <div className={s.statCard}>
          <div className={s.statIconContainer} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <IoMailSharp className={s.statIcon} style={{ color: '#3b82f6' }} />
          </div>
          <div className={s.statInfo}>
            <h3>Total Messages</h3>
            <p className={s.statValue}>{stats.totalMessages.toLocaleString()}</p>
            <span className={s.statTrend}>
              <IoArrowUp className={s.trendIconUp} />
              <span>12.5% from last month</span>
            </span>
          </div>
        </div>

        {/* Students Reached Card */}
        <div className={s.statCard}>
          <div className={s.statIconContainer} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <IoSchool className={s.statIcon} style={{ color: '#10b981' }} />
          </div>
          <div className={s.statInfo}>
            <h3>Students Reached</h3>
            <p className={s.statValue}>{stats.totalStudents.toLocaleString()}</p>
            <span className={s.statTrend}>
              <IoArrowUp className={s.trendIconUp} />
              <span>8.1% from last month</span>
            </span>
          </div>
        </div>

        {/* Delivery Rate Card */}
        <div className={s.statCard}>
          <div className={s.statIconContainer} style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>
            <IoCheckmarkDoneSharp className={s.statIcon} style={{ color: '#f97316' }} />
          </div>
          <div className={s.statInfo}>
            <h3>Delivery Rate</h3>
            <p className={s.statValue}>{stats.deliveryRate.toFixed(1)}%</p>
            <span className={s.statTrend}>
              <IoArrowUp className={s.trendIconUp} />
              <span>1.2% from last month</span>
            </span>
          </div>
        </div>

        {/* Weekly Growth Card */}
        <div className={s.statCard}>
          <div className={s.statIconContainer} style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
            <IoStatsChart className={s.statIcon} style={{ color: '#8b5cf6' }} />
          </div>
          <div className={s.statInfo}>
            <h3>Weekly Growth</h3>
            <p className={s.statValue}>{stats.weeklyGrowth.toFixed(1)}%</p>
            <span className={`${s.statTrend} ${s.negative}`}>
              <IoArrowDown className={s.trendIconDown} />
              <span>2.3% from previous week</span>
            </span>
          </div>
        </div>
      </div>

      <div className={s.chartsGrid}>
        <div className={s.chartCard}>
          <div className={s.chartHeader}>
            <h3>
              <IoTimeOutline />
              <span>Usage Over Time</span>
            </h3>
            <div className={s.chartActions}>
              <select className={s.periodSelect}>
                <option value="9months">Last 9 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="3months">Last 3 Months</option>
              </select>
            </div>
          </div>
          <div className={s.chartContainer}>
            <Line data={lineChartData} options={lineOptions} />
          </div>
        </div>

        <div className={s.chartCard}>
          <div className={s.chartHeader}>
            <h3>
              <IoCalendarOutline />
              <span>Weekly Distribution</span>
            </h3>
            <div className={s.chartActions}>
              <select className={s.periodSelect}>
                <option value="thisWeek">This Week</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
              </select>
            </div>
          </div>
          <div className={s.chartContainer}>
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>
      </div>

      <div className={s.insightsContainer}>
        <div className={s.insightCard}>
          <h3>Platform Insights</h3>
          <div className={s.insightContent}>
            <div className={s.insightItem}>
              <div className={s.insightHeader}>
                <span className={s.insightTitle}>User Engagement</span>
                <span className={s.insightValue}>High</span>
              </div>
              <div className={s.progressBar}>
                <div className={s.progressFill} style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className={s.insightItem}>
              <div className={s.insightHeader}>
                <span className={s.insightTitle}>Message Efficiency</span>
                <span className={s.insightValue}>Very Good</span>
              </div>
              <div className={s.progressBar}>
                <div className={s.progressFill} style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div className={s.insightItem}>
              <div className={s.insightHeader}>
                <span className={s.insightTitle}>Student Reach</span>
                <span className={s.insightValue}>Good</span>
              </div>
              <div className={s.progressBar}>
                <div className={s.progressFill} style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div className={s.insightItem}>
              <div className={s.insightHeader}>
                <span className={s.insightTitle}>Platform Health</span>
                <span className={s.insightValue}>Excellent</span>
              </div>
              <div className={s.progressBar}>
                <div className={s.progressFill} style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={s.featuresCard}>
          <h3>Platform Benefits</h3>
          <div className={s.featuresList}>
            <div className={s.featureItem}>
              <div className={s.featureIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <IoMailSharp style={{ color: '#3b82f6' }} />
              </div>
              <div className={s.featureContent}>
                <h4>Direct Messaging</h4>
                <p>Send targeted messages to individual students or groups.</p>
              </div>
            </div>
            
            <div className={s.featureItem}>
              <div className={s.featureIcon} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <IoSchool style={{ color: '#10b981' }} />
              </div>
              <div className={s.featureContent}>
                <h4>Student Organization</h4>
                <p>Manage students by department, year, division, and batch.</p>
              </div>
            </div>
            
            <div className={s.featureItem}>
              <div className={s.featureIcon} style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>
                <IoCheckmarkDoneSharp style={{ color: '#f97316' }} />
              </div>
              <div className={s.featureContent}>
                <h4>Delivery Tracking</h4>
                <p>Monitor message delivery status and success rates.</p>
              </div>
            </div>
            
            <div className={s.featureItem}>
              <div className={s.featureIcon} style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                <IoStatsChart style={{ color: '#8b5cf6' }} />
              </div>
              <div className={s.featureContent}>
                <h4>Usage Analytics</h4>
                <p>Gain insights from detailed usage statistics and trends.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className={s.quickActionsSection}>
        <h3>Quick Actions</h3>
        <div className={s.actionButtonsContainer}>
          <Link to="/admin/students" className={s.actionButton}>
            <div className={s.actionIconContainer}>
              <IoMailSharp />
            </div>
            <span>Send New Message</span>
          </Link>
          
          <Link to="/admin/addstudents" className={s.actionButton}>
            <div className={s.actionIconContainer}>
              <IoAdd />
            </div>
            <span>Add New Student</span>
          </Link>
          
          <Link to="/admin/history" className={s.actionButton}>
            <div className={s.actionIconContainer}>
              <IoTimeOutline />
            </div>
            <span>View History</span>
          </Link>

          <button className={s.actionButton}>
            <div className={s.actionIconContainer}>
              <IoSettings />
            </div>
            <span>Settings</span>
          </button>

          <button className={s.actionButton}>
            <div className={s.actionIconContainer}>
              <IoHelpCircleOutline />
            </div>
            <span>Get Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;