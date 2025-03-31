import React, { useState } from 'react';
import { Container, Grid, Box, Typography, IconButton, Button, Paper, Fab } from '@mui/material';
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
            <Button variant="contained" onClick={() => setEditMode(true)}>
              Add Metrics
            </Button>
          </Paper>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              margin: -1 // Compensate for the padding in MetricCard
            }}
          >
            {currentDashboard.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </Box>
        )}

        {/* Always visible floating edit button */}
        <Fab
          color="primary"
          aria-label="edit"
          onClick={() => setEditMode(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1050,
          }}
        >
          <EditIcon />
        </Fab>

        {editMode && <MetricEditor onClose={() => setEditMode(false)} />}
      </Container>

      <DashboardList open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}; 