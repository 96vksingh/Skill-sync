import { styled, keyframes } from '@mui/material/styles';
import { Card, Box, Chip } from '@mui/material';

// Animation keyframes
export const progressAnimation = keyframes`
  0% { width: 0%; }
  100% { width: var(--progress-width); }
`;

export const skillCardHover = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Styled components
export const SkillCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    animation: `${skillCardHover} 0.6s ease-in-out`,
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    transform: 'scale(1.02)',
  }
}));

export const ProgressContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '12px',
  backgroundColor: 'rgba(255,255,255,0.3)',
  borderRadius: '20px',
  overflow: 'hidden',
  marginTop: theme.spacing(1),
}));

export const ProgressBar = styled(Box)(({ theme, progress }) => ({
  height: '100%',
  background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
  borderRadius: '20px',
  width: `${progress}%`,
  animation: `${progressAnimation} 2s ease-out`,
  boxShadow: '0 2px 10px rgba(79, 172, 254, 0.4)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
    animation: 'shimmer 2s infinite',
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' }
  }
}));

export const SkillLevel = styled(Chip)(({ level }) => {
  const getColor = () => {
    switch(level?.toLowerCase()) {
      case 'expert': return { bg: '#4caf50', color: '#fff' };
      case 'advanced': return { bg: '#2196f3', color: '#fff' };
      case 'intermediate': return { bg: '#ff9800', color: '#fff' };
      case 'beginner': return { bg: '#f44336', color: '#fff' };
      default: return { bg: '#9e9e9e', color: '#fff' };
    }
  };
  
  const colors = getColor();
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontWeight: 'bold',
    fontSize: '0.75rem',
  };
});
