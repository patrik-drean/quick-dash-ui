import React, { useState } from 'react';
import { Paper, Typography, Tooltip, Box } from '@mui/material';
import { Metric } from '../../types';

interface KpiCardProps {
  metric: Metric;
}

export const KpiCard: React.FC<KpiCardProps> = ({ metric }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const isOnTarget = metric.actualValue !== undefined && 
                    metric.goalValue !== undefined && 
                    metric.actualValue >= metric.goalValue;
                    
  const statusColor = isOnTarget ? '#10b981' : '#ef4444'; // Updated green/red colors
  
  const tooltipContent = metric.goalValue !== undefined ? 
    `Goal: ${metric.goalValue}` : 
    'No goal set';
  
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
    <Tooltip
      title={tooltipContent}
      open={showTooltip}
      onOpen={() => setShowTooltip(true)}
      onClose={() => setShowTooltip(false)}
      arrow
      sx={{ fontSize: '14px' }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: 2,
          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          borderLeft: `4px solid ${statusColor}`,
          overflow: 'hidden'
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Box sx={{ overflow: 'auto', textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              color: '#64748b',
              fontWeight: 500,
              fontSize: '1rem',
              letterSpacing: '0.01em',
              marginBottom: 1.5,
              whiteSpace: 'pre-line' // Respects line breaks
            }}
          >
            {formatTextWithLineBreaks(metric.title)}
          </Typography>
          
          <Typography 
            variant="h3" 
            align="center"
            sx={{ 
              color: statusColor, 
              fontWeight: 700,
              fontSize: '2.5rem',
              marginBottom: 0.5
            }}
          >
            {metric.actualValue !== undefined ? metric.actualValue : 'N/A'}
          </Typography>
          
          {metric.goalValue !== undefined && (
            <Typography 
              variant="body2" 
              align="center"
              sx={{ 
                color: '#94a3b8', 
                fontSize: '0.875rem',
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: statusColor,
                  marginRight: '8px'
                }
              }}
            >
              {isOnTarget ? 'On target' : 'Below target'} ({metric.actualValue} of {metric.goalValue})
            </Typography>
          )}
        </Box>
      </Paper>
    </Tooltip>
  );
}; 