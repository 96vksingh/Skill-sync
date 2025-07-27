import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Box, Avatar, Chip,
  TextField, Button, Grid, CircularProgress, Alert,
  InputAdornment, IconButton, Tooltip
} from '@mui/material';
import { 
  LinkedIn, 
  Twitter, 
  Edit, 
  Save, 
  Cancel,
  OpenInNew,
  Psychology,    // NEW IMPORT
  AutoAwesome    // NEW IMPORT
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile, analyzeLinkedInProfile } from '../services/api'; // ADDED analyzeLinkedInProfile

function Profile() {
  const { setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    bio: '',
    avatar: '',
    linkedinProfile: '',
    twitterProfile: ''
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // NEW STATE VARIABLES FOR AI ANALYSIS
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzingLinkedIn, setAnalyzingLinkedIn] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setFormData({
        bio: data.bio || '',
        avatar: data.avatar || '',
        linkedinProfile: data.linkedinProfile || '',
        twitterProfile: data.twitterProfile || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear any existing error when user starts typing
    if (error) setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updated = await updateProfile(formData);
      setProfile(updated);
      setUser && setUser(updated);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(
        error.response?.data?.details?.join(', ') || 
        error.response?.data?.error || 
        'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      bio: profile?.bio || '',
      avatar: profile?.avatar || '',
      linkedinProfile: profile?.linkedinProfile || '',
      twitterProfile: profile?.twitterProfile || ''
    });
    setEditing(false);
    setError('');
  };

  // NEW FUNCTION FOR LINKEDIN ANALYSIS
  const handleLinkedInAnalysis = async () => {
    if (!profile.linkedinProfile) {
      setError('Please add your LinkedIn profile first to get AI recommendations');
      return;
    }

    setAnalyzingLinkedIn(true);
    setError('');
    
    try {
      const analysis = await analyzeLinkedInProfile();
      setAiAnalysis(analysis);
      setShowAnalysis(true);
      setSuccess('LinkedIn profile analyzed successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('LinkedIn analysis error:', error);
      setError(
        error.response?.data?.error || 
        'Failed to analyze LinkedIn profile. Please try again.'
      );
    } finally {
      setAnalyzingLinkedIn(false);
    }
  };

  const formatSocialUrl = (url, platform) => {
    if (!url) return '';
    
    // If it's already a full URL, return as is
    if (url.startsWith('http')) return url;
    
    // Handle different formats
    if (platform === 'linkedin') {
      // Remove @ if present and add full URL
      const username = url.replace(/^@/, '').replace(/^linkedin\.com\/in\//, '');
      return `https://linkedin.com/in/${username}`;
    } else if (platform === 'twitter') {
      // Remove @ if present and add full URL
      const username = url.replace(/^@/, '').replace(/^(twitter\.com\/|x\.com\/)/, '');
      return `https://twitter.com/${username}`;
    }
    
    return url;
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your profile...
        </Typography>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Profile not found</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" alignItems="center">
          {/* Profile Header */}
          <Avatar
            sx={{ width: 80, height: 80, mb: 2 }}
            src={profile.avatar || undefined}
          >
            {profile.name?.[0]}
          </Avatar>
          
          <Typography variant="h5" gutterBottom>
            {profile.name}
          </Typography>
          
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {profile.role} @ {profile.department}
          </Typography>

          {/* Skills */}
          <Box sx={{ mb: 3 }}>
            {profile.skills?.map(skill => (
              <Chip
                key={skill._id}
                label={skill.name}
                color="primary"
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>

          {/* Social Links Display (when not editing) */}
          {!editing && (
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
              {profile.linkedinProfile && (
                <Tooltip title="LinkedIn Profile">
                  <IconButton
                    color="primary"
                    onClick={() => window.open(formatSocialUrl(profile.linkedinProfile, 'linkedin'), '_blank')}
                  >
                    <LinkedIn />
                  </IconButton>
                </Tooltip>
              )}
              {profile.twitterProfile && (
                <Tooltip title="Twitter Profile">
                  <IconButton
                    color="primary"
                    onClick={() => window.open(formatSocialUrl(profile.twitterProfile, 'twitter'), '_blank')}
                  >
                    <Twitter />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}

          {/* AI LinkedIn Analysis Button */}
          {!editing && profile.linkedinProfile && (
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLinkedInAnalysis}
                disabled={analyzingLinkedIn}
                startIcon={analyzingLinkedIn ? <CircularProgress size={20} /> : <Psychology />}
                sx={{ 
                  background: 'linear-gradient(45deg, #0077B5 30%, #00A0DC 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #005885 30%, #0077B5 90%)',
                  }
                }}
              >
                {analyzingLinkedIn ? 'Analyzing LinkedIn Profile...' : 'Get AI Recommendation of Your LinkedIn Profile'}
              </Button>
            </Box>
          )}

          {/* AI Analysis Results Modal/Section */}
          {showAnalysis && aiAnalysis && (
            <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f8f9fa', width: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="primary" display="flex" alignItems="center">
                  <AutoAwesome sx={{ mr: 1 }} />
                  LinkedIn Profile AI Analysis
                </Typography>
                <Button size="small" onClick={() => setShowAnalysis(false)}>
                  Close
                </Button>
              </Box>
              
              {/* Profile Optimization */}
              {aiAnalysis.recommendations?.profile_optimization?.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                    📝 Profile Optimization
                  </Typography>
                  {aiAnalysis.recommendations.profile_optimization.map((rec, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1, pl: 2 }}>
                      • {rec}
                    </Typography>
                  ))}
                </Box>
              )}
              
              {/* Networking */}
              {aiAnalysis.recommendations?.networking?.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                    🤝 Networking Recommendations
                  </Typography>
                  {aiAnalysis.recommendations.networking.map((rec, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1, pl: 2 }}>
                      • {rec}
                    </Typography>
                  ))}
                </Box>
              )}
              
              {/* Content Strategy */}
              {aiAnalysis.recommendations?.content_strategy?.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                    📈 Content Strategy
                  </Typography>
                  {aiAnalysis.recommendations.content_strategy.map((rec, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1, pl: 2 }}>
                      • {rec}
                    </Typography>
                  ))}
                </Box>
              )}
              
              {/* Skill Development */}
              {aiAnalysis.recommendations?.skill_development?.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                    🎯 Skill Development
                  </Typography>
                  {aiAnalysis.recommendations.skill_development.map((rec, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1, pl: 2 }}>
                      • {rec}
                    </Typography>
                  ))}
                </Box>
              )}
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Analysis powered by Google Gemini AI • Generated at {aiAnalysis.timestamp ? new Date(aiAnalysis.timestamp).toLocaleString() : 'just now'}
              </Typography>
            </Box>
          )}

          {/* Profile Content */}
          <Box sx={{ width: '100%' }}>
            {editing ? (
              <Box>
                {/* Bio Field */}
                <TextField
                  label="Bio"
                  multiline
                  rows={4}
                  fullWidth
                  value={formData.bio}
                  onChange={handleInputChange('bio')}
                  sx={{ mb: 2 }}
                  placeholder="Tell us about yourself, your interests, and what you're looking for..."
                />

                {/* Avatar URL Field */}
                <TextField
                  label="Avatar URL"
                  fullWidth
                  value={formData.avatar}
                  onChange={handleInputChange('avatar')}
                  sx={{ mb: 2 }}
                  placeholder="https://example.com/your-photo.jpg"
                />

                {/* LinkedIn Profile Field */}
                <TextField
                  label="LinkedIn Profile"
                  fullWidth
                  value={formData.linkedinProfile}
                  onChange={handleInputChange('linkedinProfile')}
                  sx={{ mb: 2 }}
                  placeholder="https://linkedin.com/in/username or just username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkedIn color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: formData.linkedinProfile && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => window.open(formatSocialUrl(formData.linkedinProfile, 'linkedin'), '_blank')}
                        >
                          <OpenInNew fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                {/* Twitter Profile Field */}
                <TextField
                  label="Twitter Profile"
                  fullWidth
                  value={formData.twitterProfile}
                  onChange={handleInputChange('twitterProfile')}
                  sx={{ mb: 3 }}
                  placeholder="@username or https://twitter.com/username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Twitter color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: formData.twitterProfile && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => window.open(formatSocialUrl(formData.twitterProfile, 'twitter'), '_blank')}
                        >
                          <OpenInNew fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                {/* Action Buttons */}
                <Grid container spacing={2}>
                  <Grid item>
                    <Button 
                      variant="contained" 
                      onClick={handleSave} 
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={saving}
                      startIcon={<Cancel />}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box>
                {/* Bio Display */}
                <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                  {profile.bio || 'No bio available. Click edit to add one!'}
                </Typography>

                {/* Edit Button */}
                <Box textAlign="center">
                  <Button 
                    variant="outlined" 
                    onClick={() => setEditing(true)}
                    startIcon={<Edit />}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;
