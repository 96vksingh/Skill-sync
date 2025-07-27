import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Tabs, Tab,
  List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Button, Chip, CircularProgress, Alert
} from '@mui/material';
import { Check, Close, Person, Send, People } from '@mui/icons-material';
import { getConnections, respondToConnection } from '../services/api';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Connections() {
  const [tabValue, setTabValue] = useState(0);
  const [connections, setConnections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const data = await getConnections();
      setConnections(data);
    } catch (error) {
      setError('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (connectionId, status, userName) => {
    setResponding(connectionId);
    try {
      await respondToConnection(connectionId, status);
      await fetchConnections(); // Refresh data
      setSuccess(`Connection ${status} for ${userName}!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to respond to connection');
    } finally {
      setResponding(null);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="h4" gutterBottom>
        My Connections
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab 
            label={`Received (${connections?.received_requests?.filter(r => r.status === 'pending').length || 0})`} 
            icon={<Person />}
          />
          <Tab 
            label={`Sent (${connections?.sent_requests?.length || 0})`} 
            icon={<Send />}
          />
          <Tab 
            label={`Connected (${connections?.connections?.length || 0})`} 
            icon={<People />}
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <List>
            {connections?.received_requests?.filter(r => r.status === 'pending').map(request => (
              <ListItem key={request._id} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
                <ListItemAvatar>
                  <Avatar src={request.requester.avatar}>
                    {request.requester.name[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={request.requester.name}
                  secondary={`${request.requester.role} • ${request.message || 'No message'}`}
                />
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Check />}
                    onClick={() => handleResponse(request._id, 'accepted', request.requester.name)}
                    disabled={responding === request._id}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Close />}
                    onClick={() => handleResponse(request._id, 'rejected', request.requester.name)}
                    disabled={responding === request._id}
                  >
                    Reject
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <List>
            {connections?.sent_requests?.map(request => (
              <ListItem key={request._id}>
                <ListItemAvatar>
                  <Avatar src={request.recipient.avatar}>
                    {request.recipient.name[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={request.recipient.name}
                  secondary={request.recipient.role}
                />
                <Chip 
                  label={request.status} 
                  color={request.status === 'accepted' ? 'success' : request.status === 'pending' ? 'warning' : 'error'}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <List>
            {connections?.connections?.map(conn => {
              const otherUser = conn.requester._id === connections.user_id ? conn.recipient : conn.requester;
              return (
                <ListItem key={conn._id}>
                  <ListItemAvatar>
                    <Avatar src={otherUser.avatar}>
                      {otherUser.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={otherUser.name}
                    secondary={`${otherUser.role} • Connected ${new Date(conn.updatedAt).toLocaleDateString()}`}
                  />
                  <Chip label="Connected" color="success" />
                </ListItem>
              );
            })}
          </List>
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default Connections;
