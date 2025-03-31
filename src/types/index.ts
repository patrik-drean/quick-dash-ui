export type PriorityLevel = 'high' | 'medium' | 'low';
export type DisplaySize = 'full' | 'half' | 'quarter';
export type MetricType = 'objective' | 'list' | 'kpi';

export interface ListItem {
  id: string;
  text: string;
  priorityRank: PriorityLevel;
}

export interface Metric {
  id: string;
  type: MetricType;
  title: string;
  displaySize: DisplaySize;
  goalValue?: number;
  actualValue?: number;
  items?: ListItem[];
  onTarget?: boolean;
}

export interface Dashboard {
  id: string;
  name: string;
  metrics: Metric[];
  isStarred: boolean;
}

export type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type LayoutItem = {
  id: string; 
  position: Position;
}

export type DashboardLayout = {
  items: LayoutItem[];
} 