import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Button, Box, Card, CardContent, 
  Chip, List, ListItem, ListItemText, LinearProgress,
  Alert, CircularProgress, Tabs, Tab, Divider
} from '@mui/material';
import {
  Psychology, TrendingUp, People, School, 
  Refresh, SmartToy, Warning
} from '@mui/icons-material';
import { getAIEnhancedRecommendations, getAIServiceStatus } from '../services/api';

function AIRecommendationsPanel() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const status = await getAIServiceStatus();
      setAiStatus(status);
    } catch (err) {
      setAiStatus({ ai_service_status: 'offline' });
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAIEnhancedRecommendations({
        focus_areas: ['mentorship', 'collaboration', 'skill_development'],
        urgency: 'medium'
      });
      
      setRecommendations(response);
      
      if (!response.success) {
        setError('Using fallback recommendations - AI service unavailable');
      }
    } catch (err) {
      setError('Failed to generate recommendations');
      console.error('AI recommendations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderMentorshipTab = () => (
    <Box sx={{ mt: 2 }}>
      {recommendations?.ai_recommendations?.mentorship?.map((mentor, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{mentor.title}</Typography>
              <Chip 
                label={`${mentor.match_score || 85}% match`} 
                color="primary" 
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {mentor.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderCollaborationTab = () => (
    <Box sx={{ mt: 2 }}>
      {recommendations?.ai_recommendations?.collaboration?.map((collab, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{collab.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {collab.description}
            </Typography>
            {collab.skills_needed && (
              <Box sx={{ mt: 2 }}>
                {collab.skills_needed.map(skill => (
                  <Chip key={skill} label={skill} size="small" sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <SmartToy sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">
            AI-Powered Recommendations
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={2}>
          {aiStatus && (
            <Chip 
              label={`Gemini ${aiStatus.ai_service_status}`}
              color={aiStatus.ai_service_status === 'online' ? 'success' : 'error'}
              size="small"
            />
          )}
          <Button 
            variant="contained" 
            onClick={generateRecommendations}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Psychology />}
          >
            {loading ? 'Analyzing...' : 'Get AI Recommendations'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<Warning />}>
          {error}
        </Alert>
      )}

      {recommendations && (
        <Box>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Mentorship" />
            <Tab label="Collaboration" />
            <Tab label="Skill Development" />
          </Tabs>

          {tabValue === 0 && renderMentorshipTab()}
          {tabValue === 1 && renderCollaborationTab()}
          {tabValue === 2 && (
            <Box sx={{ mt: 2 }}>
              <List>
                {recommendations?.ai_recommendations?.skill_development?.map((skill, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={skill.title || skill.type}
                      secondary={skill.description}
                    />
                    <Chip 
                      label={skill.priority || 'Medium'} 
                      size="small" 
                      color={skill.priority === 'High' ? 'error' : 'default'}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="caption" color="text.secondary">
            Powered by Google Gemini AI • Generated {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default AIRecommendationsPanel;
