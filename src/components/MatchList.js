import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, List, ListItem,
  ListItemAvatar, Avatar, ListItemText, Chip, Divider
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { getRecommendations } from '../services/api';

function MatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendations().then(res => {
      setMatches(res.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          AI-Powered Recommendations
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <List>
            {matches.map((match, idx) => (
              <React.Fragment key={idx}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <StarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={match.title}
                    secondary={match.description}
                  />
                  <Chip label={`${match.match}% match`} color="primary" />
                </ListItem>
                {idx < matches.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default MatchList;
