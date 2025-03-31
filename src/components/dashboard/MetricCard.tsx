import React from 'react';
import { Grid } from '@mui/material';
import { Metric, DisplaySize } from '../../types';
import { ObjectiveCard } from './ObjectiveCard';
import { KpiCard } from './KpiCard';
import { PriorityList } from './PriorityList';

interface MetricCardProps {
  metric: Metric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const getSizeProps = (size: DisplaySize) => {
    switch (size) {
      case 'full':
        return { xs: 12 };
      case 'half':
        return { xs: 12, sm: 6 };
      case 'quarter':
        return { xs: 12, sm: 6, md: 3 };
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
    <Grid item {...getSizeProps(metric.displaySize)} sx={{ height: '100%' }}>
      {renderMetricCard()}
    </Grid>
  );
}; 