import React, { useState } from 'react';
import { Container, Grid, Box, Typography, IconButton, Button, Paper } from '@mui/material';
import { Edit as EditIcon, MenuOpen as MenuIcon } from '@mui/icons-material';
import { useDashboard } from '../../context/DashboardContext';
import { MetricCard } from './MetricCard';
import { DashboardList } from './DashboardList';
import { MetricEditor } from './MetricEditor';

export const DashboardView: React.FC = () => {
  const { currentDashboard } = useDashboard();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  if (!currentDashboard) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Welcome to Quick-Dash
          </Typography>
          <Typography variant="body1" paragraph>
            You don't have any dashboards yet. Create your first dashboard to get started.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setDrawerOpen(true)}
          >
            Create Dashboard
          </Button>
          <DashboardList open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Box
        sx={{
          py: 2,
          px: 3,
          bgcolor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 1,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Typography variant="h5" component="h1">
          {currentDashboard.name}
        </Typography>
        <Box>
          <IconButton color={editMode ? 'primary' : 'default'} onClick={() => setEditMode(!editMode)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {currentDashboard.metrics.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              This dashboard is empty
            </Typography>
            <Typography variant="body1" paragraph>
              Click the edit button to add metrics to your dashboard.
            </Typography>
            {!editMode && (
              <Button variant="contained" onClick={() => setEditMode(true)}>
                Edit Dashboard
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {currentDashboard.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </Grid>
        )}

        {editMode && <MetricEditor onClose={() => setEditMode(false)} />}
      </Container>

      <DashboardList open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}; 