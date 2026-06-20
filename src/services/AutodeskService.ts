import axios, { type AxiosInstance } from 'axios';
import type { Hub, Project, FolderContents, ItemVersion } from '../types/types';

/**
 * Service for interacting with Autodesk Platform Services (APS) APIs.
 * Assumes an OAuth access token is available via AuthService.getAccessToken().
 */
class AutodeskService {
  private http: AxiosInstance;

  constructor(accessToken: string) {
    this.http = axios.create({
      baseURL: 'https://developer.api.autodesk.com',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /** Get list of hubs accessible by the user */
  async getHubs(): Promise<Hub[]> {
    const resp = await this.http.get('/project/v1/hubs');
    return resp.data.data.map((item: any) => ({
      id: item.id,
      name: item.attributes.name,
    }));
  }

  /** Get a specific hub by id */
  async getHub(hubId: string): Promise<Hub> {
    const hubs = await this.getHubs();
    const hub = hubs.find((h) => h.id === hubId);
    if (!hub) throw new Error(`Hub ${hubId} not found`);
    return hub;
  }

  /** Get projects for a hub */
  async getProjects(hubId: string): Promise<Project[]> {
    const resp = await this.http.get(`/project/v1/hubs/${hubId}/projects`);
    return resp.data.data.map((item: any) => ({
      id: item.id,
      name: item.attributes.name,
    }));
  }

  /** Get a project */
  async getProject(hubId: string, projectId: string): Promise<Project> {
    const resp = await this.http.get(`/project/v1/hubs/${hubId}/projects/${projectId}`);
    return {
      id: resp.data.data.id,
      name: resp.data.data.attributes.name,
    };
  }

  /** Get folder contents */
  async getFolderContents(projectId: string, folderId: string): Promise<FolderContents> {
    const resp = await this.http.get(`/data/v1/projects/${projectId}/folders/${folderId}/contents`);
    const items = resp.data.data.map((item: any) => ({
      id: item.id,
      name: item.attributes.displayName || item.attributes.name,
      type: item.type,
    }));
    return { items };
  }

  /** Get latest version of an item (file) */
  async getLatestVersion(projectId: string, itemId: string): Promise<ItemVersion> {
    const resp = await this.http.get(`/data/v1/projects/${projectId}/items/${itemId}/versions`);
    const versions = resp.data.data;
    if (!versions || versions.length === 0) {
      throw new Error(`No versions found for item ${itemId}`);
    }
    const latest = versions[versions.length - 1];
    
    // Get the derivative URN if available, otherwise compute it by encoding the version ID
    let urn = '';
    if (latest.relationships?.derivatives?.data?.id) {
      urn = latest.relationships.derivatives.data.id;
    } else {
      urn = btoa(latest.id).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }

    return {
      id: latest.id,
      urn: urn,
      versionNumber: latest.attributes.versionNumber,
    };
  }

  /** Get top-level folders of a project */
  async getProjectTopFolders(hubId: string, projectId: string): Promise<FolderContents> {
    const resp = await this.http.get(`/project/v1/hubs/${hubId}/projects/${projectId}/topFolders`);
    const items = resp.data.data.map((item: any) => ({
      id: item.id,
      name: item.attributes.displayName || item.attributes.name,
      type: item.type || 'folders',
    }));
    return { items };
  }

  /** Get all versions of an item (file) */
  async getItemVersions(projectId: string, itemId: string): Promise<ItemVersion[]> {
    const resp = await this.http.get(`/data/v1/projects/${projectId}/items/${itemId}/versions`);
    return resp.data.data.map((item: any) => {
      let urn = '';
      if (item.relationships?.derivatives?.data?.id) {
        urn = item.relationships.derivatives.data.id;
      } else {
        urn = btoa(item.id).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      }
      return {
        id: item.id,
        urn: urn,
        versionNumber: item.attributes.versionNumber,
      };
    });
  }

  /** Translate version to viewable URN */
  async getURN(versionUrn: string): Promise<string> {
    const resp = await this.http.get(`/modelderivative/v2/designdata/${encodeURIComponent(versionUrn)}/manifest`);
    return resp.data.urn as string;
  }
}

export default AutodeskService;
