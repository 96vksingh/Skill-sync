import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, Button, Avatar,
  Chip, Skeleton, Alert, IconButton, Collapse
} from '@mui/material';
import {
  TrendingUp, Refresh, ExpandMore, ExpandLess,
  Schedule, Psychology
} from '@mui/icons-material';
import { getBannerForToday, generateNewBanner } from '../../services/api';

const DailyBanner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodayBanner();
  }, []);

  const fetchTodayBanner = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getBannerForToday();
      setBanner(response.banner);
    } catch (error) {
      console.error('Error fetching banner:', error);
      setError("Failed to load today's banner");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNew = async () => {
    try {
      setGenerating(true);
      setError('');
      await generateNewBanner();
      await fetchTodayBanner();
    } catch (error) {
      console.error('Error generating banner:', error);
      setError('Failed to generate new banner');
    } finally {
      setGenerating(false);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <Box sx={{ position: 'relative', height: 200 }}>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.1)',
            }}
          >
            <Skeleton variant="text" width={280} height={40} />
          </Box>
        </Box>
      </Card>
    );
  }

  if (error && !banner) {
    return (
      <Alert
        severity="error"
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small" onClick={fetchTodayBanner}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (!banner) return null;

  return (
    <Card
      sx={{
        mb: 3,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        height: 'auto',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Background Image from image_url */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${banner.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.85))',
          zIndex: 2,
        }}
      />

      <CardContent sx={{ position: 'relative', zIndex: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                width: 48,
                height: 48,
                mr: 2,
              }}
            >
              <TrendingUp />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {banner.title}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                <Schedule sx={{ fontSize: 16, opacity: 0.8 }} />
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
                <Chip
                  label="Today's Focus"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    ml: 1,
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Actions */}
          <Box display="flex" gap={1}>
            <IconButton
              onClick={handleGenerateNew}
              disabled={generating}
              sx={{ color: 'white' }}
              title="Regenerate Banner"
            >
              <Refresh />
            </IconButton>
            <IconButton
              onClick={handleExpandClick}
              sx={{ color: 'white' }}
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="h6"
          fontWeight="medium"
          sx={{ opacity: 0.95, mb: 2 }}
        >
          {banner.description}
        </Typography>

        {/* Expandable content */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              {banner.content}
            </Typography>

            {banner.hot_topic && (
              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ opacity: 0.9 }}
                >
                  🔥 Trending Topic:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: 'italic',
                    opacity: 0.8,
                  }}
                >
                  {banner.hot_topic}
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>

        {/* Footer */}
        <Box
          mt={2}
          pt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Box display="flex" alignItems="center">
            <Psychology sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Powered by {banner.metadata?.source || 'AI'}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={handleExpandClick}
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
                borderColor: 'white',
              },
            }}
          >
            {expanded ? 'Show Less' : 'Learn More'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DailyBanner;
