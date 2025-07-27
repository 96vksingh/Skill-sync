import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Chip, Divider,
  Accordion, AccordionSummary, AccordionDetails, Avatar,
  LinearProgress, Button, List, ListItem, ListItemText,
  ListItemIcon, Alert, CircularProgress
} from '@mui/material';
import {
  Psychology, ExpandMore, TrendingUp, People, 
  Create, School, Work, CheckCircle, LinkedIn,
  Refresh, CalendarToday, Analytics
} from '@mui/icons-material';

const LinkedInImprovementCard = ({ analysis, user, onRefresh, onAnalyze, analyzing }) => {
  const [expandedSection, setExpandedSection] = useState('profile_optimization');

  // Check if user has LinkedIn profile
  const hasLinkedInProfile = user?.linkedinProfile && user.linkedinProfile.trim() !== '';

  // If no LinkedIn profile exists, show add profile state
  if (!hasLinkedInProfile) {
    return (
      <Card sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Box textAlign="center">
          <LinkedIn sx={{ fontSize: 64, color: '#0077B5', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Add Your LinkedIn Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Connect your LinkedIn profile to get AI-powered recommendations for improvement
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<LinkedIn />}
            href="/profile" // Assuming you have a profile page
          >
            Add LinkedIn Profile
          </Button>
        </Box>
      </Card>
    );
  }

  // If LinkedIn profile exists but no analysis, show analyze button
  if (!analysis || !analysis.recommendations) {
    return (
      <Card sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #0077B5 0%, #005885 100%)',
        color: 'white',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 119, 181, 0.3)'
      }}>
        <Box textAlign="center">
          <Avatar sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            mx: 'auto',
            mb: 2,
            width: 64,
            height: 64
          }}>
            <LinkedIn sx={{ fontSize: 40, color: '#0077B5' }} />
          </Avatar>
          <Typography variant="h6" gutterBottom>
            LinkedIn Profile Connected
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
            Profile: {user.linkedinProfile}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
            Get AI-powered analysis of your LinkedIn profile to discover improvement opportunities
          </Typography>
          
          <Button 
            variant="contained"
            size="large"
            startIcon={analyzing ? <CircularProgress size={20} /> : <Analytics />}
            onClick={onAnalyze}
            disabled={analyzing}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)'
              },
              '&:disabled': {
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)'
              }
            }}
          >
            {analyzing ? 'Analyzing Profile...' : 'Get Your Profile Analysis'}
          </Button>
          
          <Typography variant="caption" sx={{ opacity: 0.7, mt: 2, display: 'block' }}>
            💡 Analysis takes 30-60 seconds and provides personalized recommendations
          </Typography>
        </Box>
      </Card>
    );
  }

  // If analysis exists, show the full analysis (existing code)
  const { recommendations, analysis_text, createdAt, ai_provider } = analysis;

  // Calculate improvement score based on number of recommendations
  const totalRecommendations = Object.values(recommendations).flat().length;
  const improvementScore = Math.min(100, Math.max(20, 100 - (totalRecommendations * 8)));

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getSectionIcon = (section) => {
    switch (section) {
      case 'profile_optimization': return <Psychology />;
      case 'networking': return <People />;
      case 'content_strategy': return <Create />;
      case 'skill_development': return <School />;
      case 'career_roadmap': return <Work />;
      default: return <TrendingUp />;
    }
  };

  const getSectionTitle = (section) => {
    switch (section) {
      case 'profile_optimization': return 'Profile Optimization';
      case 'networking': return 'Networking Strategy';
      case 'content_strategy': return 'Content Strategy';
      case 'skill_development': return 'Skill Development';
      case 'career_roadmap': return 'Career Roadmap';
      default: return section.replace('_', ' ').toUpperCase();
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  return (
    <Card sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
      mb: 3
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              mr: 2,
              width: 56,
              height: 56
            }}>
              <LinkedIn sx={{ fontSize: 32, color: '#0077B5' }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                LinkedIn Profile Analysis
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                AI-powered recommendations for profile improvement
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" gap={1}>
            {onAnalyze && (
              <Button
                variant="outlined"
                size="small"
                startIcon={analyzing ? <CircularProgress size={16} /> : <Analytics />}
                onClick={onAnalyze}
                disabled={analyzing}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {analyzing ? 'Analyzing...' : 'Re-analyze'}
              </Button>
            )}
            {onRefresh && !analyzing && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={onRefresh}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Refresh
              </Button>
            )}
          </Box>
        </Box>

        {/* Profile Score */}
        <Box 
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.1)', 
            p: 2, 
            borderRadius: 2, 
            mb: 3,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Profile Strength Score</Typography>
            <Chip 
              label={`${improvementScore}%`}
              color={getScoreColor(improvementScore)}
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={improvementScore}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                bgcolor: improvementScore >= 80 ? '#4caf50' : improvementScore >= 60 ? '#ff9800' : '#f44336'
              }
            }}
          />
          <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
            {improvementScore >= 80 ? 'Excellent profile!' : 
             improvementScore >= 60 ? 'Good profile with room for improvement' : 
             'Several areas need attention'}
          </Typography>
        </Box>

        {/* Recommendations Sections */}
        <Box>
          {Object.entries(recommendations).map(([section, items]) => (
            items.length > 0 && (
              <Accordion
                key={section}
                expanded={expandedSection === section}
                onChange={handleAccordionChange(section)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  mb: 1,
                  '&:before': {
                    display: 'none',
                  },
                  '& .MuiAccordionSummary-root': {
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                >
                  <Box display="flex" alignItems="center">
                    {getSectionIcon(section)}
                    <Typography variant="h6" sx={{ ml: 1, mr: 2 }}>
                      {getSectionTitle(section)}
                    </Typography>
                    <Chip 
                      label={`${items.length} items`}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ py: 0 }}>
                    {items.map((item, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            variant: 'body2',
                            sx: { opacity: 0.9 }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )
          ))}
        </Box>

        {/* Analysis Summary */}
        {analysis_text && (
          <Box 
            sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: 'rgba(255,255,255,0.1)', 
              borderRadius: 2,
              borderLeft: '4px solid #4caf50'
            }}
          >
            <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.9 }}>
              💡 AI Insight: {analysis_text}
            </Typography>
          </Box>
        )}

        {/* Footer */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mt={3}
          pt={2}
          sx={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
        >
          <Box display="flex" alignItems="center">
            <CalendarToday sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Last updated: {new Date(createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Chip 
            label={`Powered by ${ai_provider || 'AI'}`}
            size="small"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '0.7rem'
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default LinkedInImprovementCard;
