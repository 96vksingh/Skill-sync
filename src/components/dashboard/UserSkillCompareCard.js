import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Alert
} from '@mui/material';

export default function UserSkillCompareCard({
  strongerIn = [],
  weakerIn = [],
  flexWorthy = [],
  summary = '',
  onFlex = () => {}
}) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔍 AI-Powered Skill Comparison
        </Typography>

        {strongerIn.length > 0 && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              ✅ Skills where you're ahead:
            </Typography>
            {strongerIn.map((item, index) => (
              <Box key={item.skill + index} display="flex" flexDirection="column" mb={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip label={`${item.skill} (+${item.advantage || item.progress_delta || 'N/A'})`} color="success" />
                  {onFlex && (
                    <Button size="small" onClick={() => onFlex({ name: item.skill, reason: item.reason })}>
                      Flex This
                    </Button>
                  )}
                </Box>
                {item.comment && (
                  <Typography variant="body2" sx={{ opacity: 0.8, ml: 1, mt: 0.5 }}>
                    {item.comment}
                  </Typography>
                )}
              </Box>
            ))}
          </>
        )}

        {weakerIn.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">📉 Skills you can improve:</Typography>
            {weakerIn.map((item, index) => (
              <Box key={item.skill + index} display="flex" flexDirection="column" mb={1}>
                <Chip
                  label={`${item.skill} (${item.delta || item.progress_delta || '−%'})`}
                  color="warning"
                  sx={{ width: 'fit-content' }}
                />
                {item.suggestion && (
                  <Typography variant="body2" sx={{ opacity: 0.8, ml: 1, mt: 0.5 }}>
                    {item.suggestion}
                  </Typography>
                )}
              </Box>
            ))}
          </>
        )}

        {flexWorthy.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">💪 Flex-worthy skills:</Typography>
            {flexWorthy.map((item, index) => (
              <Box key={item.skill + index} display="flex" flexDirection="column" mb={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip label={`${item.skill} (${item.level})`} color="info" />
                  <Button size="small" onClick={() => onFlex({ name: item.skill, reason: item.reason })}>
                    Flex This
                  </Button>
                </Box>
                {item.reason && (
                  <Typography variant="body2" sx={{ opacity: 0.8, ml: 1, mt: 0.5 }}>
                    {item.reason}
                  </Typography>
                )}
              </Box>
            ))}
          </>
        )}

        {summary && (
          <>
            <Divider sx={{ my: 2 }} />
            <Alert severity="info" sx={{ fontSize: '0.9rem' }}>
              <strong>Summary:</strong> {summary}
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
}
