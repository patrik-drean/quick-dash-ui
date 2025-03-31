import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { Metric } from '../../types';

interface ObjectiveCardProps {
  metric: Metric;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({ metric }) => {
  // Transform text with \n into an array of line segments for rendering
  const formatTextWithLineBreaks = (text: string) => {
    return text.split('\\n').map((line, index) => (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        {line}
      </React.Fragment>
    ));
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 2,
        background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        borderLeft: '4px solid #4285f4',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{ 
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#1a73e8',
            letterSpacing: '-0.01em',
            whiteSpace: 'pre-line' // Respects line breaks
          }}
        >
          {formatTextWithLineBreaks(metric.title)}
        </Typography>
      </Box>
    </Paper>
  );
}; 