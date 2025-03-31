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
        return '#f44336'; // red
      case 'medium':
        return '#ff9800'; // orange
      case 'low':
        return '#4caf50'; // green
      default:
        return '#9e9e9e'; // grey
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f8f9fa',
        borderLeft: '4px solid #673ab7'
      }}
    >
      <Typography variant="h6" gutterBottom>
        {metric.title}
      </Typography>
      
      <List sx={{ width: '100%' }}>
        {metric.items?.map((item, index) => (
          <ListItem
            key={item.id}
            sx={{
              mb: 1,
              bgcolor: 'white',
              borderRadius: 1,
              boxShadow: 1,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                backgroundColor: getPriorityColor(item.priorityRank),
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4
              }
            }}
          >
            <Box
              sx={{
                minWidth: 24,
                height: 24,
                mr: 2,
                borderRadius: '50%',
                bgcolor: getPriorityColor(item.priorityRank),
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
              {index + 1}
            </Box>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}; 