import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Box, Avatar, Chip
} from '@mui/material';
import {
  People, PersonAdd, Check, Schedule
} from '@mui/icons-material';
import { getConnections } from '../../services/api';

const ConnectionStats = () => {
  const [stats, setStats] = useState({
    totalConnections: 0,
    pendingReceived: 0,
    pendingSent: 0,
    acceptanceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnectionStats();
  }, []);

  const fetchConnectionStats = async () => {
    try {
      const data = await getConnections();
      
      const totalConnections = data.connections?.length || 0;
      const pendingReceived = data.received_requests?.filter(r => r.status === 'pending').length || 0;
      const pendingSent = data.sent_requests?.filter(r => r.status === 'pending').length || 0;
      const totalSent = data.sent_requests?.length || 0;
      const accepted = data.sent_requests?.filter(r => r.status === 'accepted').length || 0;
      const acceptanceRate = totalSent > 0 ? Math.round((accepted / totalSent) * 100) : 0;

      setStats({
        totalConnections,
        pendingReceived,
        pendingSent,
        acceptanceRate
      });
    } catch (error) {
      console.error('Error fetching connection stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, description }) => (
    <Paper 
      sx={{ 
        p: 2, 
        textAlign: 'center',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Avatar sx={{ bgcolor: color, mx: 'auto', mb: 1 }}>
        <Icon />
      </Avatar>
      <Typography variant="h4" fontWeight="bold" color={color}>
        {value}
      </Typography>
      <Typography variant="body2" fontWeight="medium">
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );

  if (loading) {
    return null; // Don't show loading state for stats
  }

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={3}>
        <StatCard
          icon={People}
          label="Total Connections"
          value={stats.totalConnections}
          color="success.main"
          description="Active network"
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <StatCard
          icon={Schedule}
          label="Pending Received"
          value={stats.pendingReceived}
          color="warning.main"
          description="Awaiting response"
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <StatCard
          icon={PersonAdd}
          label="Pending Sent"
          value={stats.pendingSent}
          color="info.main"
          description="Requests sent"
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <StatCard
          icon={Check}
          label="Acceptance Rate"
          value={`${stats.acceptanceRate}%`}
          color="primary.main"
          description="Success rate"
        />
      </Grid>
    </Grid>
  );
};

export default ConnectionStats;
