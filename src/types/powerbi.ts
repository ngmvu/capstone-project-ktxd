export interface PowerBIEmbedConfig {
  embedUrl: string;
  reportId: string;
  groupId?: string;
  accessToken: string;
}

export type AutoRefreshInterval = 'off' | '1m' | '5m' | '15m';

export interface ReportState {
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;
  lastRefreshed: Date | null;
}
