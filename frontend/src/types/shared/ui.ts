export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primary_color: string;
  sidebar_collapsed: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sound: boolean;
  desktop: boolean;
  alert_level: 'low' | 'medium' | 'high';
}

export interface DashboardConfig {
  auto_refresh: boolean;
  refresh_interval: number;
  visible_widgets: string[];
  compact_mode: boolean;
}

export interface TableConfig {
  page_size: number;
  sort_by: string;
  sort_order: 'asc' | 'desc';
  visible_columns: string[];
}