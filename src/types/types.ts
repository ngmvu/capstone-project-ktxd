export interface Hub {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface FolderItem {
  id: string;
  name: string;
  type: string; // 'items' or 'folders'
}

export interface FolderContents {
  items: FolderItem[];
}

export interface ItemVersion {
  id: string;
  urn: string; // Base64-encoded URN for Viewer
  versionNumber: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}
