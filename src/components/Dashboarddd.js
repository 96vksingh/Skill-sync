import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Card, CardContent, 
  Avatar, Chip, LinearProgress, List, ListItem, ListItemText,
  ListItemAvatar, Divider, CircularProgress, Button, Badge,
  Tooltip, IconButton, Fade, Alert, useTheme
} from '@mui/material';
import {
  TrendingUp, People, School, Work, Star, LinkedIn, 
  Twitter, Psychology, Lightbulb, TrendingUpOutlined,
  PersonAdd, PersonAddDisabled, Check, Close, 
  HourglassEmpty
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

import { useAuth } from '../contexts/AuthContext';
import { 
  getDashboardData, 
  getCareerInspiration, 
  getSkillsStats,
  sendConnectionRequest,
  getConnections,
  respondToConnection
} from '../services/api';

// Animation keyframes
const progressAnimation = keyframes`
  0% { width: 0%; }
  100% { width: var(--progress-width); }
`;

const skillCardHover = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Styled components for enhanced skills display
const SkillCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    animation: `${skillCardHover} 0.6s ease-in-out`,
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    transform: 'scale(1.02)',
  }
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '12px',
  backgroundColor: 'rgba(255,255,255,0.3)',
  borderRadius: '20px',
  overflow: 'hidden',
  marginTop: theme.spacing(1),
}));

const ProgressBar = styled(Box)(({ theme, progress }) => ({
  height: '100%',
  background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
  borderRadius: '20px',
  width: `${progress}%`,
  animation: `${progressAnimation} 2s ease-out`,
  boxShadow: '0 2px 10px rgba(79, 172, 254, 0.4)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
    animation: 'shimmer 2s infinite',
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' }
  }
}));

const SkillLevel = styled(Chip)(({ level }) => {
  const getColor = () => {
    switch(level?.toLowerCase()) {
      case 'expert': return { bg: '#4caf50', color: '#fff' };
      case 'advanced': return { bg: '#2196f3', color: '#fff' };
      case 'intermediate': return { bg: '#ff9800', color: '#fff' };
      case 'beginner': return { bg: '#f44336', color: '#fff' };
      default: return { bg: '#9e9e9e', color: '#fff' };
    }
  };
  
  const colors = getColor();
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontWeight: 'bold',
    fontSize: '0.75rem',
  };
});

// Enhanced Skills Progress Component
const EnhancedSkillsProgress = ({ skillsStats = [] }) => {
  const theme = useTheme();
  const [animatedSkills, setAnimatedSkills] = useState([]);

  console.log('Skills Stats received:', skillsStats);
  console.log('Animated Skills:', animatedSkills);

  useEffect(() => {
    // Only set animated skills if skillsStats is valid
    if (skillsStats && Array.isArray(skillsStats) && skillsStats.length > 0) {
      const timer = setTimeout(() => {
        setAnimatedSkills(skillsStats);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Set empty array if no skills
      setAnimatedSkills([]);
    }
  }, [skillsStats]);

  const getSkillIcon = (skillName) => {
    const name = skillName?.toLowerCase() || '';
    if (name.includes('javascript') || name.includes('js')) return '🟨';
    if (name.includes('react')) return '⚛️';
    if (name.includes('python')) return '🐍';
    if (name.includes('node')) return '🟢';
    if (name.includes('css')) return '🎨';
    if (name.includes('html')) return '🌐';
    if (name.includes('sql')) return '🗄️';
    if (name.includes('java')) return '☕';
    return '🔧';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)';
    if (progress >= 60) return 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)';
    if (progress >= 40) return 'linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)';
    return 'linear-gradient(90deg, #fccb90 0%, #d57eeb 100%)';
  };

  const getMotivationalText = (progress) => {
    if (progress >= 80) return 'Expert Level! 🚀';
    if (progress >= 60) return 'Almost There! 💪';
    if (progress >= 40) return 'Good Progress! 📈';
    return 'Keep Going! 🌱';
  };

  // Show loading state if no skills yet
  if (!animatedSkills || animatedSkills.length === 0) {
    return (
      <Paper 
        sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              mr: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
            }}
          >
            <TrendingUp />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            Your Skills Progress
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          No skills data available yet. Add some skills to your profile to see your progress!
        </Typography>
        
        <Button variant="outlined" color="primary">
          Add Skills
        </Button>
      </Paper>
    );
  }

  return (
    <Paper 
      sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main', 
            mr: 2,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
          }}
        >
          <TrendingUp />
        </Avatar>
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          Your Skills Progress
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {animatedSkills.map((skill, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <SkillCard>
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" sx={{ mr: 1 }}>
                      {getSkillIcon(skill.name)}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {skill.name || 'Unknown Skill'}
                    </Typography>
                  </Box>
                  <SkillLevel 
                    label={skill.level || 'Intermediate'} 
                    level={skill.level}
                    size="small"
                  />
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {getMotivationalText(skill.progress || 0)}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {skill.progress || 0}%
                  </Typography>
                </Box>
                
                <ProgressContainer>
                  <ProgressBar 
                    progress={skill.progress || 0}
                    sx={{
                      background: getProgressColor(skill.progress || 0)
                    }}
                  />
                </ProgressContainer>
                
                <Box mt={1} display="flex" justifyContent="space-between">
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Progress
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {(skill.progress || 0) < 100 ? `${100 - (skill.progress || 0)}% to go` : 'Mastered!'}
                  </Typography>
                </Box>
              </CardContent>
            </SkillCard>
          </Grid>
        ))}
      </Grid>

      {/* Skills Summary */}
      <Box 
        mt={3} 
        p={2} 
        sx={{ 
          background: 'rgba(255,255,255,0.7)',
          borderRadius: 2,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography variant="h6" gutterBottom color="primary.main">
          📊 Skills Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {animatedSkills.filter(s => (s.progress || 0) >= 80).length}
              </Typography>
              <Typography variant="caption">Expert</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {animatedSkills.filter(s => (s.progress || 0) >= 60 && (s.progress || 0) < 80).length}
              </Typography>
              <Typography variant="caption">Advanced</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {animatedSkills.filter(s => (s.progress || 0) >= 40 && (s.progress || 0) < 60).length}
              </Typography>
              <Typography variant="caption">Intermediate</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {animatedSkills.filter(s => (s.progress || 0) < 40).length}
              </Typography>
              <Typography variant="caption">Beginner</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
        🎯 Keep learning and growing! Your progress is tracked automatically.
      </Typography>
    </Paper>
  );
};

// Main Dashboard Component
function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [skillsStats, setSkillsStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspirationLoading, setInspirationLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [connectingUserId, setConnectingUserId] = useState(null);
  const [respondingToConnection, setRespondingToConnection] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      console.log('Dashboard ', dashData);
      console.log('Skills stats:', statsData);

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
      
      // Refresh dashboard data to show new inspiration
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
      await sendConnectionRequest(userId, `Hi! I'd like to connect with you on SkillSync.`);
      
      // Refresh dashboard data to show updated connection status
      await fetchDashboardData();
      
      setSuccess(`Connection request sent to ${userName}!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Send connection error:', error);
      setError(
        error.response?.data?.error || 
        'Failed to send connection request. Please try again.'
      );
    } finally {
      setConnectingUserId(null);
    }
  };

  const handleConnectionResponse = async (connectionId, status, userName) => {
    if (!connectionId) {
      setError('Connection ID not found');
      return;
    }

    setRespondingToConnection(connectionId);
    setError('');

    try {
      console.log(`Responding to connection ${connectionId} with status: ${status}`);
      
      await respondToConnection(connectionId, status);
      await fetchDashboardData(); // Refresh to show updated status
      
      setSuccess(`Connection ${status} for ${userName}!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Connection response error:', error);
      setError(
        error.response?.data?.error || 
        'Failed to respond to connection request.'
      );
    } finally {
      setRespondingToConnection(null);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{ 
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
      }
    }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            <Icon />
          </Avatar>
          <Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const UserListItem = ({ userData }) => {
    const getConnectionButton = () => {
      const { connectionStatus } = userData;
      
      if (!connectionStatus) {
        // No connection - show connect button
        return (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleSendConnection(userData._id, userData.name);
            }}
            disabled={connectingUserId === userData._id}
            startIcon={
              connectingUserId === userData._id ? 
              <CircularProgress size={16} /> : 
              <PersonAdd />
            }
            sx={{ mr: 1, minWidth: '80px' }}
          >
            {connectingUserId === userData._id ? 'Sending...' : 'Connect'}
          </Button>
        );
      }
      
      if (connectionStatus.status === 'pending') {
        if (connectionStatus.isRequester) {
          // User sent the request - show pending status
          return (
            <Button
              size="small"
              variant="outlined"
              disabled
              startIcon={<HourglassEmpty />}
              sx={{ mr: 1, minWidth: '80px' }}
            >
              Pending
            </Button>
          );
        } else {
          // User received the request - show accept/reject buttons with REAL connection ID
          return (
            <Box display="flex" gap={0.5}>
              <Tooltip title="Accept Connection">
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectionResponse(
                      connectionStatus.connectionId, // USE REAL CONNECTION ID
                      'accepted', 
                      userData.name
                    );
                  }}
                  disabled={respondingToConnection === connectionStatus.connectionId}
                  sx={{ minWidth: '40px', p: '4px' }}
                >
                  {respondingToConnection === connectionStatus.connectionId ? 
                    <CircularProgress size={16} /> : 
                    <Check fontSize="small" />
                  }
                </Button>
              </Tooltip>
              <Tooltip title="Reject Connection">
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectionResponse(
                      connectionStatus.connectionId, // USE REAL CONNECTION ID
                      'rejected', 
                      userData.name
                    );
                  }}
                  disabled={respondingToConnection === connectionStatus.connectionId}
                  sx={{ minWidth: '40px', p: '4px', mr: 1 }}
                >
                  {respondingToConnection === connectionStatus.connectionId ? 
                    <CircularProgress size={16} /> : 
                    <Close fontSize="small" />
                  }
                </Button>
              </Tooltip>
            </Box>
          );
        }
      }
      
      if (connectionStatus.status === 'accepted') {
        // Already connected - show connected status
        return (
          <Button
            size="small"
            variant="contained"
            color="success"
            disabled
            startIcon={<Check />}
            sx={{ mr: 1, minWidth: '80px' }}
          >
            Connected
          </Button>
        );
      }
      
      // Connection was rejected - show connect again option
      return (
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleSendConnection(userData._id, userData.name);
          }}
          disabled={connectingUserId === userData._id}
          startIcon={<PersonAdd />}
          sx={{ mr: 1, minWidth: '80px' }}
        >
          Connect
        </Button>
      );
    };

    return (
      <ListItem
        sx={{ 
          cursor: 'pointer',
          borderRadius: 1,
          mb: 1,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            bgcolor: 'action.hover',
            transform: 'translateX(5px)'
          }
        }}
        onMouseEnter={() => setHoveredUser(userData._id)}
        onMouseLeave={() => setHoveredUser(null)}
      >
        <ListItemAvatar>
          <Avatar src={userData.avatar} sx={{ 
            border: '2px solid',
            borderColor: userData.connectionStatus?.status === 'accepted' ? 'success.main' : 'primary.main'
          }}>
            {userData.name?.[0]}
          </Avatar>
        </ListItemAvatar>
        
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" fontWeight="medium">
                {userData.name}
              </Typography>
              <Box display="flex" gap={0.5}>
                {userData.linkedinProfile && (
                  <Tooltip title="LinkedIn Profile Available">
                    <LinkedIn sx={{ fontSize: 16, color: '#0077B5' }} />
                  </Tooltip>
                )}
                {userData.twitterProfile && (
                  <Tooltip title="Twitter Profile Available">
                    <Twitter sx={{ fontSize: 16, color: '#1DA1F2' }} />
                  </Tooltip>
                )}
                {userData.connectionStatus?.status === 'accepted' && (
                  <Tooltip title="Connected">
                    <Check sx={{ fontSize: 16, color: 'success.main' }} />
                  </Tooltip>
                )}
              </Box>
            </Box>
          }
          secondary={
            <Typography variant="caption" color="text.secondary">
              {userData.role} • {userData.department}
            </Typography>
          }
        />
        
        <Box display="flex" alignItems="center">
          {/* Connection Button - Always Visible */}
          {getConnectionButton()}
          
          {/* Get Inspired Button - Show on Hover */}
          {hoveredUser === userData._id && (
            <Fade in={true}>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGetInspiration(userData._id);
                }}
                disabled={inspirationLoading && selectedUserId === userData._id}
                startIcon={
                  inspirationLoading && selectedUserId === userData._id ? 
                  <CircularProgress size={16} /> : 
                  <Lightbulb />
                }
                sx={{
                  background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF5252 30%, #26A69A 90%)',
                  }
                }}
              >
                Get Inspired
              </Button>
            </Fade>
          )}
        </Box>
      </ListItem>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom sx={{ 
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }}>
        Welcome back, {user?.name}! 👋
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Skills"
            value={skillsStats?.length || 0}
            icon={TrendingUp}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Connections"
            value={dashboardData?.all_users?.filter(u => u.connectionStatus?.status === 'accepted').length || 0}
            icon={People}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Requests"
            value={dashboardData?.all_users?.filter(u => u.connectionStatus?.status === 'pending' && !u.connectionStatus?.isRequester).length || 0}
            icon={HourglassEmpty}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inspirations"
            value={dashboardData?.latest_inspiration ? "1" : "0"}
            icon={Lightbulb}
            color="error.main"
          />
        </Grid>

        {/* Latest LinkedIn Recommendation */}
        {dashboardData?.latest_linkedin_recommendation && (
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                <Psychology sx={{ mr: 1 }} />
                Latest LinkedIn AI Analysis
              </Typography>
              
              {dashboardData.latest_linkedin_recommendation.recommendations?.profile_optimization?.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom sx={{ opacity: 0.9 }}>
                    📝 Top Recommendations:
                  </Typography>
                  {dashboardData.latest_linkedin_recommendation.recommendations.profile_optimization.slice(0, 3).map((rec, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1, pl: 2, opacity: 0.9 }}>
                      • {rec}
                    </Typography>
                  ))}
                </Box>
              )}
              
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Generated {new Date(dashboardData.latest_linkedin_recommendation.createdAt).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Latest Career Inspiration */}
        {dashboardData?.latest_inspiration && (
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: 3
            }}>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                <TrendingUpOutlined sx={{ mr: 1 }} />
                Career Inspiration from {dashboardData.latest_inspiration.source_user_id?.name}
              </Typography>
              
              {dashboardData.latest_inspiration.recommendations?.inspiration_points?.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom sx={{ opacity: 0.9 }}>
                    💡 Key Insights:
                  </Typography>
                  {dashboardData.latest_inspiration.recommendations.inspiration_points.slice(0, 3).map((point, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1, pl: 2, opacity: 0.9 }}>
                      • {point}
                    </Typography>
                  ))}
                </Box>
              )}
              
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Inspired by {dashboardData.latest_inspiration.source_user_id?.role} • {new Date(dashboardData.latest_inspiration.createdAt).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Users Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 2, 
            maxHeight: 600, 
            overflow: 'auto',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 3
          }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <People sx={{ mr: 1 }} />
              Team Members ({dashboardData?.total_users || 0})
            </Typography>
            
            <List sx={{ p: 0 }}>
              {dashboardData?.all_users?.map((userData, index) => (
                <React.Fragment key={userData._id}>
                  <UserListItem userData={userData} />
                  {index < dashboardData.all_users.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
              💡 Connect with team members and get career inspiration!
            </Typography>
          </Paper>
        </Grid>

        {/* Enhanced Skills Progress */}
        <Grid item xs={12}>
          <EnhancedSkillsProgress skillsStats={skillsStats} />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
            color: 'white',
            borderRadius: 3
          }}>
            <Typography variant="h6" gutterBottom>
              📈 Recent Activity
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                🎉 You've been matched with Sarah Chen for React mentorship
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                📈 Your JavaScript skill received 2 new endorsements
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                🚀 New project opportunity: "AI Chatbot Development" - 95% match
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                🤝 {dashboardData?.all_users?.filter(u => u.connectionStatus?.status === 'pending' && !u.connectionStatus?.isRequester).length || 0} new connection requests received
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
