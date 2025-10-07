export interface Offer {
  id: string;
  name: string;
  category: string;
  payout: string;
  country: string;
  network: string;
  metrics: string;
  website?: string;
  offerTypes?: string;
  targetAction?: string;
  testCap?: string;
  hold?: string;
  kpi?: string;
  acceptedGeos?: string;
  traffic?: string;
  notes?: string;
}

export type SortField = 'name' | 'category' | 'payout' | 'country' | 'network' | 'metrics';
export type SortDirection = 'asc' | 'desc';


