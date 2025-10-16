export interface Tool {
  id: string;
  name: string;
  type: 'fb_accounts' | 'agency_accounts' | 'proxy_providers' | 'antidetect_browsers' | 'payment_methods' | 'domains' | 'tracking' | 'spy_tools' | 'virtual_numbers' | 'pwa_services' | 'hosting';
  category: string;
  website?: string;
  languages: string[];
}

export type ToolType = 'fb_accounts' | 'agency_accounts' | 'proxy_providers' | 'antidetect_browsers' | 'payment_methods' | 'domains' | 'tracking' | 'spy_tools' | 'virtual_numbers' | 'pwa_services' | 'hosting';
export type SortField = 'name' | 'type' | 'category';
export type SortDirection = 'asc' | 'desc';
