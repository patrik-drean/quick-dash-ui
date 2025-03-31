import React from 'react';
import { Grid, Box } from '@mui/material';
import { Metric, DisplaySize } from '../../types';
import { ObjectiveCard } from './ObjectiveCard';
import { KpiCard } from './KpiCard';
import { PriorityList } from './PriorityList';

interface MetricCardProps {
  metric: Metric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  // Get grid column size based on display size setting
  const getGridWidthStyles = (size: DisplaySize) => {
    switch (size) {
      case 'full':
        return {
          width: '100%',
          flexBasis: '100%',
          maxWidth: '100%'
        };
      case 'half':
        return {
          width: { xs: '100%', sm: '50%' },
          flexBasis: { xs: '100%', sm: '50%' },
          maxWidth: { xs: '100%', sm: '50%' }
        };
      case 'quarter':
        return {
          width: { xs: '100%', sm: '50%', md: '25%' },
          flexBasis: { xs: '100%', sm: '50%', md: '25%' },
          maxWidth: { xs: '100%', sm: '50%', md: '25%' }
        };
    }
  };

  const renderMetricCard = () => {
    switch (metric.type) {
      case 'objective':
        return <ObjectiveCard metric={metric} />;
      case 'list':
        return <PriorityList metric={metric} />;
      case 'kpi':
        return <KpiCard metric={metric} />;
      default:
        return null;
    }
  };

  return (
    <Box 
      sx={{ 
        ...getGridWidthStyles(metric.displaySize),
        padding: 1,
        boxSizing: 'border-box',
        height: 300
      }}
    >
      {renderMetricCard()}
    </Box>
  );
}; 