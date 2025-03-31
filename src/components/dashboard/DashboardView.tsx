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
      <Container sx={{ py: 6 }}>
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight={600} letterSpacing="-0.02em">
            Welcome to Quick-Dash
          </Typography>
          <Typography variant="body1" paragraph color="#475569" fontSize="1.125rem" maxWidth="600px" mx="auto" mb={4}>
            You don't have any dashboards yet. Create your first dashboard to get started.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setDrawerOpen(true)}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1rem',
              fontWeight: 500,
              borderRadius: '10px',
              boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
            }}
          >
            Create Dashboard
          </Button>
          <DashboardList open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Box
        sx={{
          py: 2.5,
          px: 4,
          bgcolor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <Typography 
          variant="h5" 
          component="h1"
          sx={{
            fontWeight: 600,
            color: '#1e293b',
            letterSpacing: '-0.01em'
          }}
        >
          {currentDashboard.name}
        </Typography>
        <Box>
          <IconButton 
            onClick={() => setDrawerOpen(true)}
            sx={{
              bgcolor: '#f8fafc',
              '&:hover': {
                bgcolor: '#f1f5f9'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        {currentDashboard.metrics.length === 0 ? (
          <Paper 
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              mt: 2,
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight={600}>
              This dashboard is empty
            </Typography>
            <Typography variant="body1" paragraph color="#475569" fontSize="1.125rem" maxWidth="600px" mx="auto" mb={4}>
              Click the edit button to add metrics to your dashboard.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setEditMode(true)}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: '10px',
                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
              }}
            >
              Add Metrics
            </Button>
          </Paper>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              margin: -1,
              mt: 2
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
            width: 64,
            height: 64,
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)'
          }}
        >
          <EditIcon fontSize="medium" />
        </Fab>

        {editMode && <MetricEditor onClose={() => setEditMode(false)} />}
      </Container>

      <DashboardList open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}; 