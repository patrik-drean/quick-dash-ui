import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { Metric, PriorityLevel } from '../../types';

interface PriorityListProps {
  metric: Metric;
}

export const PriorityList: React.FC<PriorityListProps> = ({ metric }) => {
  const getPriorityColor = (priority: PriorityLevel): string => {
    switch (priority) {
      case 'high':
        return '#ef4444'; // Modern red
      case 'medium':
        return '#f59e0b'; // Modern orange/amber
      case 'low':
        return '#10b981'; // Modern green
      default:
        return '#94a3b8'; // Modern slate gray
    }
  };

  const getPriorityLabel = (priority: PriorityLevel): string => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Unknown';
    }
  };

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
        borderRadius: 2,
        background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        borderLeft: '4px solid #8b5cf6', // Modern purple
        overflow: 'hidden'
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          fontSize: '1.125rem',
          color: '#1e293b',
          letterSpacing: '0.01em',
          marginBottom: 2,
          whiteSpace: 'pre-line' // Respects line breaks
        }}
      >
        {formatTextWithLineBreaks(metric.title)}
      </Typography>
      
      <List 
        sx={{ 
          width: '100%',
          flex: 1,
          overflow: 'auto',
          py: 0,
          '&::-webkit-scrollbar': {
            width: '0.4em'
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.03)'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.15)',
            borderRadius: '4px'
          }
        }}
      >
        {metric.items?.map((item, index) => (
          <ListItem
            key={item.id}
            sx={{
              mb: 1.5,
              p: 0,
              bgcolor: 'transparent',
              position: 'relative',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                p: 2,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'flex-start', // Changed from center to flex-start for better text alignment with line breaks
                boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
                borderLeft: `3px solid ${getPriorityColor(item.priorityRank)}`
              }}
            >
              <Box
                sx={{
                  minWidth: 30,
                  height: 30,
                  mr: 2,
                  mt: 0.5, // Add a bit of top margin for alignment with multi-line text
                  borderRadius: '50%',
                  bgcolor: getPriorityColor(item.priorityRank),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}
              >
                {index + 1}
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.9375rem',
                    color: '#334155',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-line' // Respects line breaks
                  }}
                >
                  {formatTextWithLineBreaks(item.text)}
                </Typography>
                
                <Typography
                  variant="caption"
                  sx={{
                    display: 'inline-block',
                    px: 1,
                    py: 0.5,
                    mt: 0.5,
                    borderRadius: '4px',
                    backgroundColor: `${getPriorityColor(item.priorityRank)}20`,
                    color: getPriorityColor(item.priorityRank),
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                >
                  {getPriorityLabel(item.priorityRank)}
                </Typography>
              </Box>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}; 