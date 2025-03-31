import React, { useState } from 'react';
import { Paper, Typography, Box, Tooltip } from '@mui/material';
import { Metric } from '../../types';

interface KpiCardProps {
  metric: Metric;
}

export const KpiCard: React.FC<KpiCardProps> = ({ metric }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const isOnTarget = metric.actualValue !== undefined && 
                    metric.goalValue !== undefined && 
                    metric.actualValue >= metric.goalValue;
                    
  const statusColor = isOnTarget ? '#4caf50' : '#f44336'; // green if on target, red if not
  
  const tooltipContent = metric.goalValue !== undefined ? 
    `Goal: ${metric.goalValue}` : 
    'No goal set';
  
  return (
    <Tooltip
      title={tooltipContent}
      open={showTooltip}
      onOpen={() => setShowTooltip(true)}
      onClose={() => setShowTooltip(false)}
      arrow
    >
      <Paper
        elevation={2}
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          cursor: 'pointer',
          borderLeft: `4px solid ${statusColor}`,
          '&:hover': {
            boxShadow: 4
          }
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {metric.title}
        </Typography>
        
        <Typography variant="h3" color={statusColor} sx={{ fontWeight: 'bold' }}>
          {metric.actualValue !== undefined ? metric.actualValue : 'N/A'}
        </Typography>
      </Paper>
    </Tooltip>
  );
}; 