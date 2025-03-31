import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Dashboard, Metric } from '../types';

interface DashboardContextProps {
  dashboards: Dashboard[];
  currentDashboard: Dashboard | null;
  addDashboard: (name: string) => void;
  deleteDashboard: (id: string) => void;
  starDashboard: (id: string) => void;
  setCurrentDashboard: (id: string) => void;
  addMetric: (metric: Omit<Metric, 'id'>) => void;
  updateMetric: (id: string, metric: Partial<Metric>) => void;
  deleteMetric: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>(() => {
    const saved = localStorage.getItem('dashboards');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(() => {
    const saved = localStorage.getItem('currentDashboardId');
    if (saved) return saved;
    
    // Find first starred dashboard, if any
    const starredDashboard = dashboards.find(d => d.isStarred);
    return starredDashboard?.id || (dashboards.length > 0 ? dashboards[0].id : null);
  });

  // Save to localStorage whenever state changes
  React.useEffect(() => {
    localStorage.setItem('dashboards', JSON.stringify(dashboards));
  }, [dashboards]);
  
  React.useEffect(() => {
    if (currentDashboardId) {
      localStorage.setItem('currentDashboardId', currentDashboardId);
    }
  }, [currentDashboardId]);

  const currentDashboard = dashboards.find(d => d.id === currentDashboardId) || null;

  const addDashboard = (name: string) => {
    const newDashboard: Dashboard = {
      id: uuidv4(),
      name,
      metrics: [],
      isStarred: dashboards.length === 0 // Star the first dashboard by default
    };
    
    setDashboards([...dashboards, newDashboard]);
    
    // Set as current if it's the first one
    if (dashboards.length === 0) {
      setCurrentDashboardId(newDashboard.id);
    }
  };

  const deleteDashboard = (id: string) => {
    setDashboards(dashboards.filter(d => d.id !== id));
    
    // If the current dashboard is deleted, set to first available or null
    if (currentDashboardId === id) {
      const remaining = dashboards.filter(d => d.id !== id);
      setCurrentDashboardId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const starDashboard = (id: string) => {
    setDashboards(
      dashboards.map(d => ({
        ...d,
        isStarred: d.id === id
      }))
    );
  };

  const setCurrentDashboard = (id: string) => {
    setCurrentDashboardId(id);
  };

  const addMetric = (metric: Omit<Metric, 'id'>) => {
    if (!currentDashboard) return;
    
    const newMetric: Metric = {
      ...metric,
      id: uuidv4()
    };
    
    setDashboards(
      dashboards.map(d => 
        d.id === currentDashboardId
          ? { ...d, metrics: [...d.metrics, newMetric] }
          : d
      )
    );
  };

  const updateMetric = (id: string, metric: Partial<Metric>) => {
    if (!currentDashboard) return;
    
    setDashboards(
      dashboards.map(d => 
        d.id === currentDashboardId
          ? { 
              ...d, 
              metrics: d.metrics.map(m => 
                m.id === id ? { ...m, ...metric } : m
              ) 
            }
          : d
      )
    );
  };

  const deleteMetric = (id: string) => {
    if (!currentDashboard) return;
    
    setDashboards(
      dashboards.map(d => 
        d.id === currentDashboardId
          ? { ...d, metrics: d.metrics.filter(m => m.id !== id) }
          : d
      )
    );
  };

  const value = {
    dashboards,
    currentDashboard,
    addDashboard,
    deleteDashboard,
    starDashboard,
    setCurrentDashboard,
    addMetric,
    updateMetric,
    deleteMetric,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}; 