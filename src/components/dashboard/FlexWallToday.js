// FlexWallToday.js
import React from 'react';
import { Card, CardContent, Box, Typography, Avatar, Chip } from '@mui/material';

export default function FlexWallToday({ flexes }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">💪 Today's Flex Wall</Typography>
        {flexes.length === 0 && <Typography variant="body2">No flexes yet today.</Typography>}
{flexes.map(flex => (
  <Box key={flex._id} display="flex" flexDirection="column" mb={1}>
    <Box display="flex" alignItems="center" gap={1}>
      <Avatar src={flex.user.avatar}>{flex.user.name?.[0]}</Avatar>
      <Typography variant="body2">
        <strong>{flex.user.name}</strong> flexed {' '}
        <Chip label={flex.skill} color="primary" size="small" />{' '}
        {flex.progress && <>(<strong>{flex.progress}%</strong>)</>}
      </Typography>
    </Box>
    {flex.reason && (
      <Typography variant="caption" sx={{ ml: 7, mt: 0.5, fontStyle: 'italic', color: 'gray' }}>
        “{flex.reason}”
      </Typography>
    )}
  </Box>
))}

      </CardContent>
    </Card>
  );
}
