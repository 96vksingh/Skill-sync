import { useState, useEffect } from 'react';
import { 
  getDashboardData, 
  getCareerInspiration, 
  getSkillsStats,
  sendConnectionRequest,
  respondToConnection
} from '../../../services/api';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [skillsStats, setSkillsStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspirationLoading, setInspirationLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [connectingUserId, setConnectingUserId] = useState(null);
  const [respondingToConnection, setRespondingToConnection] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [dashData, statsData] = await Promise.all([
        getDashboardData().catch(err => {
          console.error('Dashboard data error:', err);
          return null;
        }),
        getSkillsStats().catch(err => {
          console.error('Skills stats error:', err);
          return [];
        })
      ]);
      
      setDashboardData(dashData);
      
      // DEBUG: Log the connection data
      console.log('Dashboard data received:', dashData);
      if (dashData?.all_users) {
        console.log('Users with connection status:');
        dashData.all_users.forEach((user, index) => {
          console.log(`${index + 1}. ${user.name}:`, {
            connectionStatus: user.connectionStatus,
            hasConnectionId: !!user.connectionStatus?.connectionId,
            status: user.connectionStatus?.status,
            isRequester: user.connectionStatus?.isRequester
          });
        });
      }

      // Handle different response formats from your API
      if (statsData && Array.isArray(statsData)) {
        setSkillsStats(statsData);
      } else if (statsData && statsData.data && Array.isArray(statsData.data)) {
        setSkillsStats(statsData.data);
      } else {
        setSkillsStats([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard ', error);
      setError('Failed to load dashboard data');
      setSkillsStats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetInspiration = async (userId) => {
    setInspirationLoading(true);
    setSelectedUserId(userId);
    setError('');
    
    try {
      const inspiration = await getCareerInspiration(userId);
      await fetchDashboardData();
      setSuccess(`Career inspiration generated from ${inspiration.inspiration_source.name}!`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Get inspiration error:', error);
      setError('Failed to generate career inspiration. Please try again.');
    } finally {
      setInspirationLoading(false);
      setSelectedUserId(null);
    }
  };

  const handleSendConnection = async (userId, userName) => {
    setConnectingUserId(userId);
    setError('');
    
    try {
      console.log('Sending connection request to:', userId, userName);
      await sendConnectionRequest(userId, `Hi! I'd like to connect with you on SkillSync.`);
      await fetchDashboardData();
      setSuccess(`Connection request sent to ${userName}!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Send connection error:', error);
      setError(error.response?.data?.error || 'Failed to send connection request. Please try again.');
    } finally {
      setConnectingUserId(null);
    }
  };

// In components/dashboard/hooks/useDashboardData.js
const handleConnectionResponse = async (connectionId, status, userName) => {
  if (!connectionId) {
    console.error('No connection ID provided');
    setError('Connection ID not found - please refresh the page');
    return;
  }

  setRespondingToConnection(connectionId);
  setError('');

  try {
    console.log(`Responding to connection ${connectionId} with status: ${status}`);
    await respondToConnection(connectionId, status);
    
    // IMPORTANT: Force refresh dashboard data after connection response
    await fetchDashboardData();
    
    setSuccess(`Connection ${status} for ${userName}!`);
    setTimeout(() => setSuccess(''), 3000);
  } catch (error) {
    console.error('Connection response error:', error);
    setError(error.response?.data?.error || 'Failed to respond to connection request.');
  } finally {
    setRespondingToConnection(null);
  }
};


  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    skillsStats,
    loading,
    inspirationLoading,
    selectedUserId,
    connectingUserId,
    respondingToConnection,
    error,
    success,
    setError,
    setSuccess,
    handleGetInspiration,
    handleSendConnection,
    handleConnectionResponse,
    fetchDashboardData
  };
};
