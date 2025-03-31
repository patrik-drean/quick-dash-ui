import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useDashboard } from '../../context/DashboardContext';
import { useState } from 'react';

interface DashboardListProps {
  open: boolean;
  onClose: () => void;
}

export const DashboardList: React.FC<DashboardListProps> = ({ open, onClose }) => {
  const { 
    dashboards, 
    currentDashboard, 
    setCurrentDashboard, 
    deleteDashboard, 
    starDashboard,
    addDashboard
  } = useDashboard();

  const [newDashboardName, setNewDashboardName] = useState('');

  const handleAddDashboard = () => {
    if (newDashboardName.trim()) {
      addDashboard(newDashboardName.trim());
      setNewDashboardName('');
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '80%', sm: 350 },
          boxSizing: 'border-box',
          p: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Dashboards</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          label="New Dashboard Name"
          variant="outlined"
          value={newDashboardName}
          onChange={(e) => setNewDashboardName(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddDashboard}
          disabled={!newDashboardName.trim()}
        >
          Create Dashboard
        </Button>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {dashboards.length === 0 ? (
          <ListItem>
            <ListItemText
              primary="No dashboards yet"
              secondary="Create a dashboard to get started"
            />
          </ListItem>
        ) : (
          dashboards.map((dashboard) => (
            <ListItem
              key={dashboard.id}
              disablePadding
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    onClick={() => starDashboard(dashboard.id)}
                    color={dashboard.isStarred ? 'primary' : 'default'}
                  >
                    {dashboard.isStarred ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                  <IconButton edge="end" onClick={() => deleteDashboard(dashboard.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
              sx={{
                bgcolor: currentDashboard?.id === dashboard.id ? 'action.selected' : 'transparent',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemButton
                onClick={() => {
                  setCurrentDashboard(dashboard.id);
                  onClose();
                }}
                dense
              >
                <ListItemText
                  primary={dashboard.name}
                  primaryTypographyProps={{
                    fontWeight: currentDashboard?.id === dashboard.id ? 'bold' : 'normal',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Drawer>
  );
}; 