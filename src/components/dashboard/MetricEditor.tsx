import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  IconButton,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@mui/icons-material/Close';
import { useDashboard } from '../../context/DashboardContext';
import { Dashboard, DisplaySize, ListItem as ListItemType, Metric, MetricType, PriorityLevel } from '../../types';

interface MetricEditorProps {
  onClose: () => void;
}

export const MetricEditor: React.FC<MetricEditorProps> = ({ onClose }) => {
  const { currentDashboard } = useDashboard();
  
  const [open, setOpen] = useState(true); // Always start open
  const [csvInput, setCsvInput] = useState('');
  const [csvError, setCsvError] = useState<string | null>(null);
  
  // Generate CSV representation of a metric
  const metricToCsvLine = (metric: Metric): string => {
    let line = `${metric.type}, "${metric.title}", `;
    
    if (metric.type === 'list' && metric.items && metric.items.length > 0) {
      const itemsStr = metric.items
        .map((item: ListItemType) => `${item.text}/${item.priorityRank}`)
        .join(', ');
      line += `"${itemsStr}", `;
    } else if (metric.type === 'kpi') {
      if (metric.goalValue !== undefined && metric.actualValue !== undefined) {
        line += `"${metric.actualValue} of ${metric.goalValue}", `;
      } else if (metric.actualValue !== undefined) {
        line += `"${metric.actualValue}", `;
      } else {
        line += `"", `;
      }
    } else {
      line += `"", `;
    }
    
    line += `"${metric.displaySize}"`;
    return line;
  };
  
  // Convert all metrics to CSV format
  const dashboardToCsv = (metrics: Metric[]): string => {
    return metrics.map(metricToCsvLine).join('\n');
  };
  
  // Initialize CSV with current dashboard metrics
  React.useEffect(() => {
    if (currentDashboard && currentDashboard.metrics.length > 0) {
      const csvData = dashboardToCsv(currentDashboard.metrics);
      setCsvInput(csvData);
    }
  }, [currentDashboard]);

  const handleClose = () => {
    setOpen(false);
    setCsvInput('');
    setCsvError(null);
    onClose();
  };

  const parseCSVLine = (line: string): { type: MetricType; title: string; displaySize: DisplaySize; items?: ListItemType[]; goalValue?: number; actualValue?: number } | null => {
    // Handle quoted parts correctly
    const parts: string[] = [];
    let currentPart = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(currentPart.trim());
        currentPart = '';
      } else {
        currentPart += char;
      }
    }
    
    if (currentPart.trim()) {
      parts.push(currentPart.trim());
    }
    
    if (parts.length < 3) {
      return null;
    }
    
    const type = parts[0].toLowerCase().replace(/"/g, '') as MetricType;
    if (!['objective', 'list', 'kpi'].includes(type)) {
      return null;
    }
    
    const title = parts[1].replace(/^"|"$/g, '');
    if (!title) {
      return null;
    }
    
    let displaySize: DisplaySize = 'half';
    let sizeStr = parts[parts.length - 1].toLowerCase().replace(/^"|"$/g, '');
    if (['full', 'half', 'quarter'].includes(sizeStr)) {
      displaySize = sizeStr as DisplaySize;
    }
    
    if (type === 'objective') {
      return { type, title, displaySize };
    } 
    else if (type === 'list') {
      // For list type, the third parameter should be list items
      const listContent = parts[2].replace(/^"|"$/g, '');
      const listItems = listContent.split(',').map(item => {
        const [text, priorityStr = 'medium'] = item.trim().split('/');
        let priorityRank: PriorityLevel = 'medium';
        if (['high', 'medium', 'low'].includes(priorityStr?.toLowerCase() || '')) {
          priorityRank = priorityStr.toLowerCase() as PriorityLevel;
        }
        return {
          id: uuidv4(),
          text: text.trim(),
          priorityRank
        };
      });
      
      return { type, title, displaySize, items: listItems };
    } 
    else if (type === 'kpi') {
      // For KPI type, try to parse "X of Y" format or just a value
      const valueContent = parts[2].replace(/^"|"$/g, '');
      const valueParts = valueContent.split(/\s+of\s+/);
      
      if (valueParts.length === 2) {
        const actual = parseFloat(valueParts[0]);
        const goal = parseFloat(valueParts[1]);
        if (!isNaN(actual) && !isNaN(goal)) {
          return { type, title, displaySize, actualValue: actual, goalValue: goal };
        }
      } else {
        const value = parseFloat(valueContent);
        if (!isNaN(value)) {
          return { type, title, displaySize, actualValue: value };
        }
      }
    }
    
    return { type, title, displaySize };
  };

  const saveMetrics = () => {
    if (!csvInput.trim()) {
      setCsvError("Please enter some CSV data");
      return;
    }
    
    const lines = csvInput.split('\n').filter(line => line.trim() !== '');
    const validMetrics: Omit<Metric, 'id'>[] = [];
    const errors: string[] = [];
    
    lines.forEach((line, idx) => {
      try {
        const parsedMetric = parseCSVLine(line);
        if (parsedMetric) {
          // Add onTarget property for KPI metrics
          if (parsedMetric.type === 'kpi' && parsedMetric.goalValue !== undefined && parsedMetric.actualValue !== undefined) {
            (parsedMetric as any).onTarget = parsedMetric.actualValue >= parsedMetric.goalValue;
          }
          validMetrics.push(parsedMetric);
        } else {
          errors.push(`Line ${idx + 1}: Could not parse metric`);
        }
      } catch (err) {
        errors.push(`Line ${idx + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    });
    
    if (errors.length > 0) {
      setCsvError(errors.join('\n'));
      return;
    }
    
    if (currentDashboard) {
      try {
        // Get current dashboards from local storage
        const dashboardsStr = localStorage.getItem('dashboards');
        if (!dashboardsStr) {
          setCsvError("Could not find dashboards in localStorage");
          return;
        }
        
        const allDashboards = JSON.parse(dashboardsStr) as Dashboard[];
        
        // Find current dashboard and modify its metrics
        const updatedDashboards = allDashboards.map(dashboard => {
          if (dashboard.id === currentDashboard.id) {
            // Create new metrics with IDs
            const newMetricsWithIds = validMetrics.map(metric => ({
              ...metric,
              id: uuidv4() // Generate new IDs for each metric
            }));
            
            // Return updated dashboard
            return {
              ...dashboard,
              metrics: newMetricsWithIds
            };
          }
          return dashboard;
        });
        
        // Write directly to localStorage
        localStorage.setItem('dashboards', JSON.stringify(updatedDashboards));
        
        // Close the dialog
        handleClose();
        
        // Force a reload of the page to ensure everything is in sync
        window.location.reload();
      } catch (err) {
        console.error("Error updating dashboard metrics:", err);
        setCsvError("An error occurred while updating metrics. Please try again.");
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle 
        sx={{
          px: 3,
          py: 2.5,
          bgcolor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#1e293b', 
            fontSize: '1.25rem'
          }}
        >
          Edit Dashboard Metrics
        </Typography>
        <IconButton 
          onClick={handleClose} 
          edge="end" 
          sx={{ color: '#64748b' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ pt: 1 }}>
          <Typography 
            variant="body1" 
            paragraph
            sx={{
              color: '#334155',
              fontSize: '1rem',
              fontWeight: 500,
              mb: 2
            }}
          >
            Edit all metrics in CSV format. Each line represents one metric:
          </Typography>
          <Box 
            component="pre" 
            sx={{ 
              bgcolor: '#f1f5f9', 
              p: 2.5, 
              mb: 3, 
              borderRadius: 2, 
              fontSize: '0.875rem', 
              whiteSpace: 'pre-wrap',
              color: '#334155',
              fontFamily: '"Consolas", "Monaco", monospace',
              border: '1px solid #e2e8f0',
              overflow: 'auto',
              maxHeight: '180px'
            }}
          >
            Objective, "2025 objective to do X", "Full"
            Objective, "Q2 rocks: \n Improve job page beta CSAT from 3.9 to 4.25 \n Migrate 900 logos from legacy jobs", "Full"
            List, "Upcoming Projects", "Laundry/High, Dishes/Medium, Make breakfast/Low", "Half"
            KPI, "Tickets Done", "10 of 20", "Quarter"
          </Box>
          
          {csvError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 1.5,
                fontSize: '0.875rem'
              }}
            >
              {csvError}
            </Alert>
          )}
          
          <TextField
            fullWidth
            multiline
            rows={15}
            label="CSV Metrics"
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            placeholder={'Objective, "2025 objective to do X", "Full"\nList, "Upcoming Projects", "Laundry/High, Dishes/Medium, Make breakfast/Low", "Half"\nKPI, "Tickets Done", "10 of 20", "Quarter"'}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                fontSize: '0.9375rem',
                fontFamily: '"Consolas", "Monaco", monospace',
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions 
        sx={{ 
          px: 3, 
          py: 2.5,
          bgcolor: '#f8fafc',
          borderTop: '1px solid #e2e8f0'
        }}
      >
        <Button 
          onClick={handleClose}
          sx={{
            color: '#64748b',
            fontWeight: 500,
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={saveMetrics} 
          variant="contained"
          disabled={!csvInput.trim()}
          sx={{
            px: 4,
            py: 1,
            borderRadius: 1.5,
            fontWeight: 500
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 