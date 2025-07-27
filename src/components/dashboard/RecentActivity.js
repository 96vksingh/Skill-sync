import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';

const RecentActivity = ({ dashboardData }) => {
  return (
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
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
            💡 {dashboardData?.latest_inspiration ? '1 new career inspiration received' : 'Generate career inspiration from team members'}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default RecentActivity;
