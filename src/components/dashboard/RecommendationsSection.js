import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Psychology, TrendingUpOutlined } from '@mui/icons-material';

const RecommendationsSection = ({ dashboardData }) => {
  return (
    <>
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
            
{dashboardData.latest_inspiration?.analysis_text && (
  <Box mb={2}>
    <Typography variant="subtitle2" gutterBottom sx={{ opacity: 0.9 }}>
      💡 Key Insights:
    </Typography>

    {/* Process and Render as Points */}
    <Box sx={{ pl: 2 }}>
      <ul style={{ margin: 0, paddingLeft: "1rem" }}>
        {dashboardData.latest_inspiration.analysis_text
          .split(/\d+\.\s|\-\s/) // split by numbered points or hyphen bullets
          .map((point, index) => point.trim())
          .filter((point) => point.length > 0)
          .map((point, idx) => (
            <li key={idx} style={{ marginBottom: "8px", opacity: 0.9 }}>
              {point}
            </li>
          ))}
      </ul>
    </Box>
  </Box>
)}
            
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Inspired by {dashboardData.latest_inspiration.source_user_id?.role} • {new Date(dashboardData.latest_inspiration.createdAt).toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>
      )}
    </>
  );
};

export default RecommendationsSection;
