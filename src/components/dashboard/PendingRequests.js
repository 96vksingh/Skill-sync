import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Box, List, ListItem, ListItemText,
  ListItemAvatar, Avatar, Button, CircularProgress, Chip,
  Card, CardContent, Divider, Alert, Fade
} from '@mui/material';
import {
  People, Check, Close, Schedule, Person, LinkedIn, Twitter
} from '@mui/icons-material';
import { getConnections, respondToConnection } from '../../services/api';

const PendingRequestCard = ({ 
  request, 
  onRespond, 
  responding 
}) => {
  const requester = request.requester;
  
  return (
    <Card 
      sx={{ 
        mb: 2, 
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {/* User Info */}
          <Box display="flex" alignItems="center" flex={1}>
            <Avatar 
              src={requester.avatar}
              sx={{ 
                width: 56, 
                height: 56, 
                mr: 2,
                border: '2px solid',
                borderColor: 'primary.main'
              }}
            >
              {requester.name?.[0]}
            </Avatar>
            
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Typography variant="h6" fontWeight="bold">
                  {requester.name}
                </Typography>
                {requester.linkedinProfile && (
                  <LinkedIn sx={{ fontSize: 18, color: '#0077B5' }} />
                )}
                {requester.twitterProfile && (
                  <Twitter sx={{ fontSize: 18, color: '#1DA1F2' }} />
                )}
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {requester.role} • {requester.department}
              </Typography>
              
              {request.message && (
                <Typography variant="body2" sx={{ 
                  bgcolor: 'grey.100', 
                  p: 1, 
                  borderRadius: 1,
                  fontStyle: 'italic',
                  mt: 1
                }}>
                  "{request.message}"
                </Typography>
              )}
              
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Chip 
                  icon={<Schedule />}
                  label={`${new Date(request.createdAt).toLocaleDateString()}`}
                  size="small"
                  variant="outlined"
                />
                <Chip 
                  label={request.connection_type || 'General'}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
          
          {/* Action Buttons */}
          <Box display="flex" flexDirection="column" gap={1} ml={2}>
            <Button
              variant="contained"
              color="success"
              startIcon={responding === `${request._id}-accepted` ? 
                <CircularProgress size={16} /> : <Check />
              }
              onClick={() => onRespond(request._id, 'accepted', requester.name)}
              disabled={responding?.startsWith(request._id)}
              sx={{ minWidth: '120px' }}
            >
              {responding === `${request._id}-accepted` ? 'Accepting...' : 'Accept'}
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={responding === `${request._id}-rejected` ? 
                <CircularProgress size={16} /> : <Close />
              }
              onClick={() => onRespond(request._id, 'rejected', requester.name)}
              disabled={responding?.startsWith(request._id)}
              sx={{ minWidth: '120px' }}
            >
              {responding === `${request._id}-rejected` ? 'Rejecting...' : 'Reject'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const PendingRequests = ({ onUpdate }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const connectionsData = await getConnections();
      const pending = connectionsData.received_requests?.filter(
        request => request.status === 'pending'
      ) || [];
      setPendingRequests(pending);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setError('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (connectionId, status, userName) => {
    setResponding(`${connectionId}-${status}`);
    setError('');
    
    try {
      await respondToConnection(connectionId, status);
      
      // Remove the request from local state
      setPendingRequests(prev => 
        prev.filter(request => request._id !== connectionId)
      );
      
      setSuccess(`Connection ${status} for ${userName}!`);
      setTimeout(() => setSuccess(''), 3000);
      
      // Notify parent component to update dashboard data
      if (onUpdate) {
        onUpdate();
      }
      
    } catch (error) {
      console.error('Connection response error:', error);
      setError('Failed to respond to connection request.');
    } finally {
      setResponding(null);
    }
  };

  if (loading) {
    return (
      <Grid item xs={12}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading pending requests...
          </Typography>
        </Paper>
      </Grid>
    );
  }

  return (
    <Grid item xs={12}>
      <Paper sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #fff3e0 0%, #ffccbc 100%)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <Avatar 
              sx={{ 
                bgcolor: 'warning.main', 
                mr: 2,
                background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)'
              }}
            >
              <People />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                Pending Connection Requests
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pendingRequests.length} request{pendingRequests.length !== 1 ? 's' : ''} waiting for your response
              </Typography>
            </Box>
          </Box>
          
          {pendingRequests.length > 0 && (
            <Chip 
              label={`${pendingRequests.length} Pending`}
              color="warning"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>

        {/* Success/Error Messages */}
        {success && (
          <Fade in={true}>
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          </Fade>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Pending Requests List */}
        {pendingRequests.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Pending Requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              When team members send you connection requests, they'll appear here.
            </Typography>
          </Box>
        ) : (
          <Box>
            {pendingRequests.map((request, index) => (
              <PendingRequestCard
                key={request._id}
                request={request}
                onRespond={handleResponse}
                responding={responding}
              />
            ))}
          </Box>
        )}

        {/* Footer Info */}
        <Box 
          mt={3} 
          pt={2} 
          sx={{ 
            borderTop: '1px solid rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}
        >
          <Typography variant="caption" color="text.secondary">
            💡 Tip: Accepting connections helps build your professional network within the company
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default PendingRequests;
