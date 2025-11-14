export interface PaginationParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface DateRange {
  start: string;
  end: string;
}

export interface FilterCriteria {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  include_sensitive: boolean;
  date_range?: DateRange;
}