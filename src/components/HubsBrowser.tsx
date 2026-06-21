import React, { useEffect, useState } from 'react';
import { 
  Box, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Collapse, 
  CircularProgress, 
  Typography 
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import BusinessIcon from '@mui/icons-material/Business';
import HistoryIcon from '@mui/icons-material/History';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutodeskService from '../services/AutodeskService';
import { getStoredToken } from '../services/AuthService';

interface HubsBrowserProps {
  onVersionSelected: (urn: string) => void;
}

interface TreeNode {
  id: string;
  name: string;
  type: 'hub' | 'project' | 'folder' | 'item' | 'version';
  children?: TreeNode[];
  expanded?: boolean;
  loading?: boolean;
  loaded?: boolean;
  hubId?: string;
  projectId?: string;
  folderId?: string;
  itemId?: string;
  urn?: string;
}

export const HubsBrowser: React.FC<HubsBrowserProps> = ({ onVersionSelected }) => {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = getStoredToken();

  // Load initial hubs on mount
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadHubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const service = new AutodeskService(token);
        const hubs = await service.getHubs();
        console.log('Autodesk hubs API response:', hubs);
        
        const hubNodes: TreeNode[] = hubs.map(hub => ({
          id: `hub|${hub.id}`,
          name: hub.name,
          type: 'hub',
          hubId: hub.id,
          children: [],
          expanded: false,
          loaded: false,
          loading: false,
        }));
        setNodes(hubNodes);
      } catch (err: any) {
        console.error('Failed to load hubs. Full error details:', err);
        if (err.response) {
          console.error('Autodesk API Error response data:', err.response.data);
        }
        setError(err.message || 'Failed to load hubs. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    };

    loadHubs();
  }, [token]);

  // Recursively update a node in the tree
  const updateNode = (
    treeNodes: TreeNode[], 
    nodeId: string, 
    updates: Partial<TreeNode>
  ): TreeNode[] => {
    return treeNodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: updateNode(node.children, nodeId, updates)
        };
      }
      return node;
    });
  };

  // Expand or collapse a node and load child contents dynamically if needed
  const handleToggle = async (node: TreeNode) => {
    if (!token) return;

    const service = new AutodeskService(token);
    const isExpanding = !node.expanded;

    // Toggle expanded state immediately
    setNodes(prev => updateNode(prev, node.id, { expanded: isExpanding }));

    // If expanding and not loaded yet, fetch children
    if (isExpanding && !node.loaded && !node.loading) {
      setNodes(prev => updateNode(prev, node.id, { loading: true }));
      try {
        let children: TreeNode[] = [];

        switch (node.type) {
          case 'hub': {
            const projects = await service.getProjects(node.hubId!);
            children = projects.map(p => ({
              id: `project|${node.hubId}|${p.id}`,
              name: p.name,
              type: 'project',
              hubId: node.hubId,
              projectId: p.id,
              children: [],
              expanded: false,
              loaded: false,
              loading: false,
            }));
            break;
          }
          case 'project': {
            const topFolders = await service.getProjectTopFolders(node.hubId!, node.projectId!);
            children = topFolders.items.map(f => ({
              id: `folder|${node.hubId}|${node.projectId}|${f.id}`,
              name: f.name,
              type: 'folder',
              hubId: node.hubId,
              projectId: node.projectId,
              folderId: f.id,
              children: [],
              expanded: false,
              loaded: false,
              loading: false,
            }));
            break;
          }
          case 'folder': {
            const contents = await service.getFolderContents(node.projectId!, node.folderId!);
            children = contents.items.map(item => ({
              id: `${item.type === 'folders' ? 'folder' : 'item'}|${node.hubId}|${node.projectId}|${item.id}`,
              name: item.name,
              type: item.type === 'folders' ? 'folder' : 'item',
              hubId: node.hubId,
              projectId: node.projectId,
              folderId: item.type === 'folders' ? item.id : node.folderId,
              itemId: item.type === 'items' ? item.id : undefined,
              children: [],
              expanded: false,
              loaded: false,
              loading: false,
            }));
            break;
          }
          case 'item': {
            const versions = await service.getItemVersions(node.projectId!, node.itemId!);
            children = versions.map(v => ({
              id: `version|${v.id}`,
              name: `Version ${v.versionNumber}`,
              type: 'version',
              urn: v.urn,
            }));
            break;
          }
          default:
            break;
        }

        console.log(`Successfully loaded children for node ${node.id} (${node.type}):`, children);
        setNodes(prev => updateNode(prev, node.id, { 
          children, 
          loaded: true, 
          loading: false 
        }));
      } catch (err: any) {
        console.error(`Failed to load children for ${node.id}:`, err);
        if (err.response) {
          console.error('API error response for children:', err.response.data);
        }
        setNodes(prev => updateNode(prev, node.id, { 
          loading: false, 
          expanded: false 
        }));
      }
    }
  };

  const handleNodeClick = (node: TreeNode) => {
    if (node.type === 'version' && node.urn) {
      onVersionSelected(node.urn);
    } else {
      handleToggle(node);
    }
  };

  // Helper to render tree nodes recursively with indent padding
  const renderTreeNodes = (treeNodes: TreeNode[], depth: number = 0) => {
    return treeNodes.map(node => {
      const isExpanded = node.expanded;
      const isLoading = node.loading;
      const hasChildren = node.type !== 'version';

      let icon = <ChevronRightIcon />;
      if (node.type === 'hub') icon = <DeviceHubIcon sx={{ color: '#1976D2' }} />;
      if (node.type === 'project') icon = <BusinessIcon sx={{ color: '#0288d1' }} />;
      if (node.type === 'folder') icon = <FolderIcon sx={{ color: '#ED6C02' }} />;
      if (node.type === 'item') icon = <InsertDriveFileIcon sx={{ color: '#64748B' }} />;
      if (node.type === 'version') icon = <HistoryIcon sx={{ color: '#2E7D32' }} />;

      return (
        <React.Fragment key={node.id}>
          <ListItemButton 
            onClick={() => handleNodeClick(node)}
            sx={{ 
              pl: 2 + depth * 2, 
              py: 0.75,
              borderRadius: 2,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {isLoading ? <CircularProgress size={20} color="inherit" /> : icon}
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography 
                  sx={{ 
                    fontSize: node.type === 'hub' ? '0.9rem' : '0.85rem',
                    fontWeight: node.type === 'hub' || node.type === 'project' ? 600 : 400,
                    color: '#1D2939',
                  }}
                  noWrap
                >
                  {node.name}
                </Typography>
              } 
            />
            {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
          {node.children && node.children.length > 0 && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderTreeNodes(node.children, depth + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      </Box>
    );
  }

  if (nodes.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No Hubs found. Make sure your account has access to ACC/BIM 360 projects.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowY: 'auto', maxHeight: '100%' }}>
      <List component="nav" disablePadding>
        {renderTreeNodes(nodes)}
      </List>
    </Box>
  );
};
export default HubsBrowser;
