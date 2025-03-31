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
        return { gridColumn: { xs: 'span 12' } };
      case 'half':
        return { gridColumn: { xs: 'span 12', sm: 'span 6' } };
      case 'quarter':
        return { gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } };
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
    <Grid sx={{ height: '100%', ...getSizeProps(metric.displaySize) }}>
      {renderMetricCard()}
    </Grid>
  );
}; 