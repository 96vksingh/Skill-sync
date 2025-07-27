import React, { useState } from 'react';
import {
  Grid, Paper, Typography, Box, List, ListItem, ListItemText,
  ListItemAvatar, Avatar, Divider, Button, CircularProgress,
  Tooltip, Fade
} from '@mui/material';
import {
  People, LinkedIn, Twitter, PersonAdd, HourglassEmpty,
  Check, Close, Lightbulb
} from '@mui/icons-material';

const UserListItem = ({ 
  userData, 
  hoveredUser, 
  setHoveredUser,
  connectingUserId,
  respondingToConnection,
  inspirationLoading,
  selectedUserId,
  handleSendConnection,
  handleConnectionResponse,
  handleGetInspiration
}) => {
  // Add more detailed debugging
  console.log(`🔍 User: ${userData.name}`, {
    connectionStatus: userData.connectionStatus,
    status: userData.connectionStatus?.status,
    isConnected: userData.connectionStatus?.status === 'accepted'
  });

  const isConnected = userData.connectionStatus?.status === 'accepted';
  
  const getConnectionButton = () => {
    const { connectionStatus } = userData;
    
    // IMPORTANT: Return null (no button) if connected
    if (connectionStatus?.status === 'accepted') {
      console.log(`✅ User ${userData.name} is connected - hiding connection button`);
      return null;
    }
    
    if (!connectionStatus) {
      console.log(`➡️ User ${userData.name} has no connection - showing Connect button`);
      return (
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleSendConnection(userData._id, userData.name);
          }}
          disabled={connectingUserId === userData._id}
          startIcon={
            connectingUserId === userData._id ? 
            <CircularProgress size={16} /> : 
            <PersonAdd />
          }
          sx={{ mr: 1, minWidth: '80px' }}
        >
          {connectingUserId === userData._id ? 'Sending...' : 'Connect'}
        </Button>
      );
    }
    
    if (connectionStatus.status === 'pending') {
      if (connectionStatus.isRequester) {
        console.log(`⏳ User ${userData.name} - request sent, showing Pending`);
        return (
          <Button
            size="small"
            variant="outlined"
            disabled
            startIcon={<HourglassEmpty />}
            sx={{ mr: 1, minWidth: '80px' }}
          >
            Pending
          </Button>
        );
      } else {
        console.log(`📨 User ${userData.name} sent you a request - showing Accept/Reject`);
        return (
          <Box display="flex" gap={0.5}>
            <Tooltip title="Accept Connection">
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConnectionResponse(
                    connectionStatus.connectionId,
                    'accepted', 
                    userData.name
                  );
                }}
                disabled={respondingToConnection === connectionStatus.connectionId}
                sx={{ minWidth: '40px', p: '4px' }}
              >
                {respondingToConnection === connectionStatus.connectionId ? 
                  <CircularProgress size={16} /> : 
                  <Check fontSize="small" />
                }
              </Button>
            </Tooltip>
            <Tooltip title="Reject Connection">
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConnectionResponse(
                    connectionStatus.connectionId,
                    'rejected', 
                    userData.name
                  );
                }}
                disabled={respondingToConnection === connectionStatus.connectionId}
                sx={{ minWidth: '40px', p: '4px', mr: 1 }}
              >
                {respondingToConnection === connectionStatus.connectionId ? 
                  <CircularProgress size={16} /> : 
                  <Close fontSize="small" />
                }
              </Button>
            </Tooltip>
          </Box>
        );
      }
    }
    
    if (connectionStatus.status === 'rejected') {
      console.log(`❌ User ${userData.name} - connection was rejected, showing Connect again`);
      return (
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleSendConnection(userData._id, userData.name);
          }}
          disabled={connectingUserId === userData._id}
          startIcon={<PersonAdd />}
          sx={{ mr: 1, minWidth: '80px' }}
        >
          Connect
        </Button>
      );
    }

    // Fallback - show connect button if status is unknown
    console.log(`❓ User ${userData.name} - unknown status: ${connectionStatus.status}, showing Connect`);
    return (
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={(e) => {
          e.stopPropagation();
          handleSendConnection(userData._id, userData.name);
        }}
        disabled={connectingUserId === userData._id}
        startIcon={<PersonAdd />}
        sx={{ mr: 1, minWidth: '80px' }}
      >
        Connect
      </Button>
    );
  };

  const getInspireButton = () => {
    // For connected users, always show the inspire button
    if (isConnected) {
      return (
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={(e) => {
            e.stopPropagation();
            handleGetInspiration(userData._id);
          }}
          disabled={inspirationLoading && selectedUserId === userData._id}
          startIcon={
            inspirationLoading && selectedUserId === userData._id ? 
            <CircularProgress size={16} /> : 
            <Lightbulb />
          }
          sx={{
            background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF5252 30%, #26A69A 90%)',
            },
            minWidth: '130px'
          }}
        >
          Get Inspired
        </Button>
      );
    }
    
    // For non-connected users, show on hover only
    if (hoveredUser === userData._id) {
      return (
        <Fade in={true}>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleGetInspiration(userData._id);
            }}
            disabled={inspirationLoading && selectedUserId === userData._id}
            startIcon={
              inspirationLoading && selectedUserId === userData._id ? 
              <CircularProgress size={16} /> : 
              <Lightbulb />
            }
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252 30%, #26A69A 90%)',
              }
            }}
          >
            Get Inspired
          </Button>
        </Fade>
      );
    }
    
    return null;
  };

  return (
    <ListItem
      sx={{ 
        cursor: 'pointer',
        borderRadius: 1,
        mb: 1,
        transition: 'all 0.2s ease-in-out',
        bgcolor: isConnected ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
        border: isConnected ? '1px solid rgba(76, 175, 80, 0.2)' : 'none',
        '&:hover': {
          bgcolor: isConnected ? 'rgba(76, 175, 80, 0.1)' : 'action.hover',
          transform: 'translateX(5px)'
        }
      }}
      onMouseEnter={() => setHoveredUser(userData._id)}
      onMouseLeave={() => setHoveredUser(null)}
    >
      <ListItemAvatar>
        <Avatar src={userData.avatar} sx={{ 
          border: '2px solid',
          borderColor: isConnected ? 'success.main' : 'primary.main',
          boxShadow: isConnected ? '0 0 10px rgba(76, 175, 80, 0.3)' : 'none'
        }}>
          {userData.name?.[0]}
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" fontWeight="medium">
              {userData.name}
            </Typography>
            <Box display="flex" gap={0.5}>
              {userData.linkedinProfile && (
                <Tooltip title="LinkedIn Profile Available">
                  <LinkedIn sx={{ fontSize: 16, color: '#0077B5' }} />
                </Tooltip>
              )}
              {userData.twitterProfile && (
                <Tooltip title="Twitter Profile Available">
                  <Twitter sx={{ fontSize: 16, color: '#1DA1F2' }} />
                </Tooltip>
              )}
              {isConnected && (
                <Tooltip title="Connected">
                  <Check sx={{ fontSize: 16, color: 'success.main' }} />
                </Tooltip>
              )}
            </Box>
          </Box>
        }
        secondary={
          <Box>
            <Typography variant="caption" color="text.secondary">
              {userData.role} • {userData.department}
            </Typography>
            {isConnected && (
              <Typography variant="caption" color="success.main" sx={{ display: 'block', fontWeight: 'medium' }}>
                ✓ Connected
              </Typography>
            )}
          </Box>
        }
      />
      
      <Box display="flex" alignItems="center" gap={1}>
        {/* Connection Button - Hidden for connected users */}
        {getConnectionButton()}
        
        {/* Get Inspired Button */}
        {getInspireButton()}
      </Box>
    </ListItem>
  );
};

// Rest of the component remains the same...
const UsersSidebar = ({ 
  dashboardData,
  hoveredUser,
  setHoveredUser,
  connectingUserId,
  respondingToConnection,
  inspirationLoading,
  selectedUserId,
  handleSendConnection,
  handleConnectionResponse,
  handleGetInspiration
}) => {
  const connectedUsers = dashboardData?.all_users?.filter(u => u.connectionStatus?.status === 'accepted') || [];
  const otherUsers = dashboardData?.all_users?.filter(u => u.connectionStatus?.status !== 'accepted') || [];

  return (
    <Grid item xs={12} md={4}>
      <Paper sx={{ 
        p: 2, 
        maxHeight: 600, 
        overflow: 'auto',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 3
      }}>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
          <People sx={{ mr: 1 }} />
          Team Members ({dashboardData?.total_users || 0})
        </Typography>
        
        <List sx={{ p: 0 }}>
          {/* Connected Users First */}
          {connectedUsers.length > 0 && (
            <>
              <Typography variant="caption" color="success.main" sx={{ 
                fontWeight: 'bold', 
                p: 1, 
                display: 'block',
                bgcolor: 'rgba(76, 175, 80, 0.1)',
                borderRadius: 1,
                mb: 1,
                textAlign: 'center'
              }}>
                ✓ Connected ({connectedUsers.length})
              </Typography>
              {connectedUsers.map((userData, index) => (
                <React.Fragment key={userData._id}>
                  <UserListItem 
                    userData={userData}
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
                  {index < connectedUsers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {otherUsers.length > 0 && <Divider sx={{ my: 2 }} />}
            </>
          )}
          
          {/* Other Users */}
          {otherUsers.length > 0 && (
            <>
              {connectedUsers.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ 
                  fontWeight: 'bold', 
                  p: 1, 
                  display: 'block',
                  textAlign: 'center',
                  mb: 1
                }}>
                  Other Team Members ({otherUsers.length})
                </Typography>
              )}
              {otherUsers.map((userData, index) => (
                <React.Fragment key={userData._id}>
                  <UserListItem 
                    userData={userData}
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
                  {index < otherUsers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </>
          )}
        </List>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          💡 Connected users show "Get Inspired" - discover their career journey!
        </Typography>
      </Paper>
    </Grid>
  );
};

export default UsersSidebar;
