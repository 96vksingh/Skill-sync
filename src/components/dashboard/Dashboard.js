import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Alert, Button, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardData } from './hooks/useDashboardData';
import { analyzeLinkedInProfile, compareSkills, flexSkill, getFlexWallToday } from '../../services/api';

// Dashboard Sections
import DailyBanner from './DailyBanner';
import StatsCards from './StatsCards';
import ConnectionStats from './ConnectionStats';
import LinkedInImprovementCard from './LinkedInImprovementCard';
import PendingRequests from './PendingRequests';
import RecommendationsSection from './RecommendationsSection';
import UsersSidebar from './UsersSidebar';
import SkillsProgress from './SkillsProgress';
import RecentActivity from './RecentActivity';
import UserSkillCompareCard from './UserSkillCompareCard';
import FlexWallToday from './FlexWallToday';

function Dashboard() {
  const { user } = useAuth();
  const [hoveredUser, setHoveredUser] = useState(null);
  const [analyzingLinkedIn, setAnalyzingLinkedIn] = useState(false);
  const [compareToUserId, setCompareToUserId] = useState('');
  const [compareResult, setCompareResult] = useState(null);
  const [flexWallToday, setFlexWallToday] = useState([]);

  const {
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
  } = useDashboardData();

  // On mount, fetch today's flex wall
  useEffect(() => {
    fetchFlexWall();
  }, []);

  const fetchFlexWall = async () => {
    try {
      const data = await getFlexWallToday();
      setFlexWallToday(data || []);
    } catch (err) {
      console.warn('Failed to fetch flex wall:', err.message);
    }
  };

  const handleAnalyzeLinkedIn = async () => {
    setAnalyzingLinkedIn(true);
    setError('');
    try {
      setSuccess('🔍 Analyzing your LinkedIn profile...');
      await analyzeLinkedInProfile();
      await fetchDashboardData();
      setSuccess('✅ LinkedIn analysis complete!');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to analyze LinkedIn profile.');
    } finally {
      setAnalyzingLinkedIn(false);
    }
  };

  const handleCompareSkills = async () => {
    if (!compareToUserId) return setError('Please select someone to compare with.');
    try {
      const data = await compareSkills({ compareTo: compareToUserId });
      setCompareResult(data);
    } catch (err) {
      setError('Failed to compare.');
    }
  };

  const handleFlexSkill = async (skillObj) => {
    try {
      console.log('Flexing skill:', skillObj);
      await flexSkill({ skill: skillObj.name, progress: skillObj.my_progress, reason: skillObj.reason });
      await fetchFlexWall();
      setSuccess(`🎉 You flexed ${skillObj.name}!`);
    } catch (err) {
      setError('Failed to flex skill.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 6, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
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

      {/* Welcome */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}
      >
        Welcome back, {user?.name || 'Professional'} 👋
      </Typography>

      {/* 🔥 Daily Banner */}
      <DailyBanner />

      {/* 🎯 Compare With Teammates */}
      <Grid item xs={12} sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>🆚 Compare Skills with Teammate</Typography>
        <Box display="flex" gap={2} alignItems="center" mb={1}>
          <select
            value={compareToUserId}
            onChange={(e) => setCompareToUserId(e.target.value)}
          >
            <option value="">Select a user</option>
            {(dashboardData?.all_users || []).map(u => (
              <option key={u._id} value={u._id}>{u.name} — {u.role}</option>
            ))}
          </select>
          <Button variant="contained" onClick={handleCompareSkills}>Compare</Button>
        </Box>
        {compareResult && (
          <UserSkillCompareCard
            {...compareResult}
            onFlex={handleFlexSkill}
          />
        )}
      </Grid>

      {/* 💪 Flex Wall */}
      <Grid item xs={12}>
        <FlexWallToday flexes={flexWallToday} />
      </Grid>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <StatsCards skillsStats={skillsStats} dashboardData={dashboardData} />
        <Grid item xs={12}>
          <ConnectionStats />
        </Grid>

        {/* LinkedIn Insights */}
        <Grid item xs={12}>
          <LinkedInImprovementCard
            analysis={dashboardData?.latest_linkedin_recommendation}
            user={user}
            onAnalyze={handleAnalyzeLinkedIn}
            analyzing={analyzingLinkedIn}
            onRefresh={fetchDashboardData}
          />
        </Grid>

        <PendingRequests onUpdate={fetchDashboardData} />
        <RecommendationsSection dashboardData={dashboardData} />

        {/* Team Connections */}
        <UsersSidebar
          dashboardData={dashboardData}
          hoveredUser={hoveredUser}
          setHoveredUser={setHoveredUser}
          connectingUserId={connectingUserId}
          respondingToConnection={respondingToConnection}
          inspirationLoading={inspirationLoading}
          selectedUserId={selectedUserId}
          handleSendConnection={handleSendConnection}
          handleConnectionResponse={handleConnectionResponse}
          handleGetInspiration={handleGetInspiration}
        />

        {/* Skills */}
        <SkillsProgress skillsStats={skillsStats} />

        {/* Recent Activity */}
        <RecentActivity dashboardData={dashboardData} />
      </Grid>
    </Container>
  );
}

export default Dashboard;
