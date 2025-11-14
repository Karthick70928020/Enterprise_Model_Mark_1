import axios from 'axios';

const REPORT_API_BASE = '/api/reports';

const reportApi = axios.create({
  baseURL: REPORT_API_BASE,
  timeout: 30000, // Longer timeout for report generation
});

export const reportApiService = {
  // Generate report
  generate: async (type: string, parameters: any) => {
    const response = await reportApi.post('/generate', {
      type,
      parameters,
    });
    return response.data;
  },

  // Get report status
  getStatus: async (reportId: string) => {
    const response = await reportApi.get(`/status/${reportId}`);
    return response.data;
  },

  // Download report
  download: async (reportId: string, format: string = 'pdf') => {
    const response = await reportApi.get(`/download/${reportId}`, {
      params: { format },
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${reportId}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // List available reports
  list: async (type?: string, dateRange?: { start: string; end: string }) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (dateRange) {
      params.append('start', dateRange.start);
      params.append('end', dateRange.end);
    }
    
    const response = await reportApi.get(`/list?${params.toString()}`);
    return response.data;
  },

  // Schedule report
  schedule: async (scheduleConfig: any) => {
    const response = await reportApi.post('/schedule', scheduleConfig);
    return response.data;
  },

  // Get scheduled reports
  getScheduled: async () => {
    const response = await reportApi.get('/scheduled');
    return response.data;
  },

  // Delete report
  delete: async (reportId: string) => {
    const response = await reportApi.delete(`/delete/${reportId}`);
    return response.data;
  }
};

export default reportApiService;