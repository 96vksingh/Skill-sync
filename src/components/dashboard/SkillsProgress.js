import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Box, Avatar, Button, CardContent, useTheme
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { SkillCard, ProgressContainer, ProgressBar, SkillLevel } from './styles';

const SkillsProgress = ({ skillsStats = [] }) => {
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
    if (name.includes('typescript') || name.includes('ts')) return '🔷';
    if (name.includes('angular')) return '🅰️';
    if (name.includes('vue')) return '💚';
    if (name.includes('docker')) return '🐳';
    if (name.includes('aws')) return '☁️';
    if (name.includes('mongodb')) return '🍃';
    if (name.includes('mysql')) return '🐬';
    if (name.includes('redis')) return '🔴';
    if (name.includes('git')) return '📝';
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

  const getProficiencyColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'expert': return '#4caf50';
      case 'advanced': return '#2196f3';
      case 'intermediate': return '#ff9800';
      case 'beginner': return '#f44336';
      default: return theme.palette.grey[500];
    }
  };

  // Show empty state if no skills yet
  if (!animatedSkills || animatedSkills.length === 0) {
    return (
      <Grid item xs={12}>
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
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                width: 56,
                height: 56
              }}
            >
              <TrendingUp fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              Your Skills Progress
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            No skills data available yet. Add some skills to your profile to see your progress!
          </Typography>
          
          <Button variant="contained" color="primary" size="large">
            Add Skills to Your Profile
          </Button>
        </Paper>
      </Grid>
    );
  }

  return (
    <Grid item xs={12}>
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
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              width: 56,
              height: 56
            }}
          >
            <TrendingUp fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              Your Skills Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your professional development journey
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {animatedSkills.map((skill, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <SkillCard>
                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6" sx={{ mr: 1 }}>
                        {getSkillIcon(skill.name)}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {skill.name || 'Unknown Skill'}
                      </Typography>
                    </Box>
                    <SkillLevel 
                      label={skill.level || skill.proficiency || 'Intermediate'} 
                      level={skill.level || skill.proficiency}
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

                  {/* Years of Experience */}
                  {skill.years_of_experience && (
                    <Box mt={1} display="flex" justifyContent="center">
                      <Typography variant="caption" sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        opacity: 0.9
                      }}>
                        {skill.years_of_experience} {skill.years_of_experience === 1 ? 'year' : 'years'} experience
                      </Typography>
                    </Box>
                  )}
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

          {/* Skill Categories Breakdown */}
          <Box mt={2}>
            <Typography variant="subtitle2" color="primary.main" gutterBottom>
              💼 Skills by Category
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {Object.entries(
                animatedSkills.reduce((acc, skill) => {
                  const category = skill.category || 'Technical';
                  acc[category] = (acc[category] || 0) + 1;
                  return acc;
                }, {})
              ).map(([category, count]) => (
                <Box 
                  key={category}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem'
                  }}
                >
                  {category}: {count}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          🎯 Keep learning and growing! Your progress is tracked automatically based on your activities and endorsements.
        </Typography>
      </Paper>
    </Grid>
  );
};

export default SkillsProgress;
