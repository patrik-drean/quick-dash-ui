import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { useDashboard } from '../../context/DashboardContext';
import { DisplaySize, ListItem as ListItemType, Metric, MetricType, PriorityLevel } from '../../types';

interface MetricEditorProps {
  onClose: () => void;
}

export const MetricEditor: React.FC<MetricEditorProps> = ({ onClose }) => {
  const { currentDashboard, addMetric, updateMetric, deleteMetric } = useDashboard();
  
  const [open, setOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);
  
  const [type, setType] = useState<MetricType>('objective');
  const [title, setTitle] = useState('');
  const [displaySize, setDisplaySize] = useState<DisplaySize>('half');
  const [goalValue, setGoalValue] = useState<string>('');
  const [actualValue, setActualValue] = useState<string>('');
  const [items, setItems] = useState<ListItemType[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [newItemPriority, setNewItemPriority] = useState<PriorityLevel>('medium');
  
  const handleOpen = (metric?: Metric) => {
    if (metric) {
      setEditingMetric(metric);
      setType(metric.type);
      setTitle(metric.title);
      setDisplaySize(metric.displaySize);
      setGoalValue(metric.goalValue?.toString() || '');
      setActualValue(metric.actualValue?.toString() || '');
      setItems(metric.items || []);
    } else {
      setEditingMetric(null);
      setType('objective');
      setTitle('');
      setDisplaySize('half');
      setGoalValue('');
      setActualValue('');
      setItems([]);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setType('objective');
    setTitle('');
    setDisplaySize('half');
    setGoalValue('');
    setActualValue('');
    setItems([]);
    setNewItemText('');
    setNewItemPriority('medium');
    setEditingMetric(null);
  };

  const handleSave = () => {
    const metricData: Omit<Metric, 'id'> = {
      type,
      title,
      displaySize,
      items: type === 'list' ? items : undefined,
      goalValue: type === 'kpi' && goalValue ? parseFloat(goalValue) : undefined,
      actualValue: type === 'kpi' && actualValue ? parseFloat(actualValue) : undefined,
      onTarget:
        type === 'kpi' && goalValue && actualValue
          ? parseFloat(actualValue) >= parseFloat(goalValue)
          : undefined,
    };

    if (editingMetric) {
      updateMetric(editingMetric.id, metricData);
    } else {
      addMetric(metricData);
    }
    
    handleClose();
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      setItems([
        ...items,
        {
          id: uuidv4(),
          text: newItemText.trim(),
          priorityRank: newItemPriority,
        },
      ]);
      setNewItemText('');
      setNewItemPriority('medium');
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const isFormValid = () => {
    if (!title.trim()) return false;
    
    if (type === 'kpi') {
      const isGoalNumeric = goalValue ? !isNaN(parseFloat(goalValue)) : true;
      const isActualNumeric = actualValue ? !isNaN(parseFloat(actualValue)) : true;
      return isGoalNumeric && isActualNumeric;
    }
    
    if (type === 'list') {
      return items.length > 0;
    }
    
    return true;
  };

  return (
    <>
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1050 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: 28, px: 3 }}
        >
          Add Metric
        </Button>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Edit Dashboard
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          {currentDashboard?.metrics.map((metric) => (
            <Grid key={metric.id} sx={{ gridColumn: { xs: 'span 12' } }}>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{metric.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {metric.type} | Size: {metric.displaySize}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpen(metric)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => deleteMetric(metric.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={onClose}>
            Done
          </Button>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingMetric ? 'Edit Metric' : 'Add New Metric'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Metric Type</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as MetricType)}
                label="Metric Type"
              >
                <MenuItem value="objective">Objective</MenuItem>
                <MenuItem value="list">Priority List</MenuItem>
                <MenuItem value="kpi">KPI</MenuItem>
              </Select>
              <FormHelperText>
                {type === 'objective'
                  ? 'A high-level objective with no specific metrics'
                  : type === 'list'
                  ? 'A prioritized list of items'
                  : 'A key performance indicator with target values'}
              </FormHelperText>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Display Size</InputLabel>
              <Select
                value={displaySize}
                onChange={(e) => setDisplaySize(e.target.value as DisplaySize)}
                label="Display Size"
              >
                <MenuItem value="quarter">Quarter Width</MenuItem>
                <MenuItem value="half">Half Width</MenuItem>
                <MenuItem value="full">Full Width</MenuItem>
              </Select>
              <FormHelperText>How much space this metric should take up</FormHelperText>
            </FormControl>

            {type === 'kpi' && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Goal Value"
                  type="number"
                  value={goalValue}
                  onChange={(e) => setGoalValue(e.target.value)}
                  InputProps={{
                    inputProps: { step: 'any' }
                  }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Actual Value"
                  type="number"
                  value={actualValue}
                  onChange={(e) => setActualValue(e.target.value)}
                  InputProps={{
                    inputProps: { step: 'any' }
                  }}
                />
              </>
            )}

            {type === 'list' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Priority Items
                </Typography>
                <List dense>
                  {items.map((item) => (
                    <ListItem key={item.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                      <ListItemText
                        primary={item.text}
                        secondary={`Priority: ${item.priorityRank}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleRemoveItem(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ display: 'flex', mt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="New Item"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    sx={{ mr: 1 }}
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select
                      labelId="priority-label"
                      size="small"
                      value={newItemPriority}
                      onChange={(e) => setNewItemPriority(e.target.value as PriorityLevel)}
                      label="Priority"
                    >
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleAddItem}
                    disabled={!newItemText.trim()}
                    sx={{ ml: 1 }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!isFormValid()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 