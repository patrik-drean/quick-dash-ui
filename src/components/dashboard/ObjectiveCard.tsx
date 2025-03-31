import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Metric } from '../../types';

interface ObjectiveCardProps {
  metric: Metric;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({ metric }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: '#f8f9fa',
        borderLeft: '4px solid #4285f4'
      }}
    >
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {metric.title}
      </Typography>
    </Paper>
  );
}; 