import React from 'react';
import { Grid, Card, CardContent, Box, Avatar, Typography } from '@mui/material';
import { TrendingUp, People, HourglassEmpty, Lightbulb } from '@mui/icons-material';

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

const StatsCards = ({ skillsStats, dashboardData }) => {
  return (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Active Skills"
          value={skillsStats?.length || 0}
          icon={TrendingUp}
          color="primary.main"
        />
      </Grid>
      {/* <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Connections"
          value={dashboardData?.all_users?.filter(u => u.connectionStatus?.status === 'accepted').length || 0}
          icon={People}
          color="success.main"
        />
      </Grid> */}
      {/* <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Pending Requests"
          value={dashboardData?.all_users?.filter(u => u.connectionStatus?.status === 'pending' && !u.connectionStatus?.isRequester).length || 0}
          icon={HourglassEmpty}
          color="warning.main"
        />
      </Grid> */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Inspirations"
          value={dashboardData?.latest_inspiration ? "1" : "0"}
          icon={Lightbulb}
          color="error.main"
        />
      </Grid>
    </>
  );
};

export default StatsCards;
