import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import { getStoredToken } from '../services/AuthService';

interface AutodeskViewerProps {
  onConnect: () => void;
  urn: string | null;
  onLoadStatusChange?: (status: string) => void;
}

export const AutodeskViewer: React.FC<AutodeskViewerProps> = ({ onConnect, urn, onLoadStatusChange }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<Autodesk.Viewing.GuiViewer3D | null>(null);
  const token = getStoredToken();
  const [loadStatus, setLoadStatus] = useState<string>('');

  // Notify parent component of loading status changes
  useEffect(() => {
    if (onLoadStatusChange) {
      onLoadStatusChange(loadStatus);
    }
  }, [loadStatus, onLoadStatusChange]);

  // Define request translation function
  const requestTranslation = useCallback(async (encodedUrn: string) => {
    try {
      const resp = await fetch(
        'https://developer.api.autodesk.com/modelderivative/v2/designdata/job',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: { urn: encodedUrn },
            output: {
              formats: [{ type: 'svf2', views: ['3d', '2d'] }],
            },
          }),
        }
      );
      const result = await resp.json();
      console.log('Translation request result:', result);
      if (resp.ok) {
        setLoadStatus('⏳ Translation đã được gửi. Đợi chuyển đổi (có thể mất vài phút)...');
        console.log('Translation job submitted. Will poll status periodically.');
      } else {
        console.error('Translation request failed:', result);
        setLoadStatus(`❌ Lỗi: ${result.diagnostic || 'Translation request failed'}`);
      }
    } catch (err) {
      console.error('Failed to request translation:', err);
      setLoadStatus('⚠️ Lỗi yêu cầu. Cố gắng tải model...');
    }
  }, [token]);

  // Define check translation status function (polling only)
  const checkTranslationStatus = useCallback(
    async (encodedUrn: string): Promise<boolean> => {
      const MAX_RETRIES = 24;
      const MAX_WAIT_TIME = 15000;
      let retryCount = 0;

      const performCheck = async (pollDelay: number): Promise<boolean> => {
        try {
          setLoadStatus(`⏳ Kiểm tra trạng thái... (Lần ${retryCount + 1}/${MAX_RETRIES})`);
          const resp = await fetch(
            `https://developer.api.autodesk.com/modelderivative/v2/designdata/${encodedUrn}/manifest`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (resp.status === 404) {
            console.warn('Model manifest not found (404). Requesting translation...');
            setLoadStatus('⚠️ Model chưa được translate. Đang yêu cầu translate...');
            await requestTranslation(encodedUrn);
            return false;
          }

          const manifest = await resp.json();
          console.log('Model manifest:', manifest);

          if (manifest.status === 'success') {
            setLoadStatus('✅ Model ready. Loading 3D viewer...');
            return true;
          } else if (manifest.status === 'inprogress') {
            const progress = manifest.progress || 'unknown';
            setLoadStatus(`⏳ Đang chuyển đổi model... (${progress})`);
            console.log('Translation in progress:', progress);

            if (retryCount >= MAX_RETRIES) {
              console.warn(`Translation timeout after ${MAX_RETRIES} retries. Attempting to load anyway...`);
              setLoadStatus('⏳ Chuyển đổi đang chậm. Cố gắng tải model...');
              return true;
            }

            retryCount++;
            const delay = Math.min(pollDelay * 1.2, MAX_WAIT_TIME);
            await new Promise(resolve => setTimeout(resolve, delay));
            return performCheck(delay);
          } else if (manifest.status === 'failed') {
            setLoadStatus('❌ Translation failed. Check model format.');
            console.error('Translation failed:', manifest);
            return false;
          } else {
            setLoadStatus(`⏳ Translation status: ${manifest.status}...`);

            if (retryCount >= MAX_RETRIES) {
              console.warn(`Max retries reached for status ${manifest.status}`);
              return true;
            }

            retryCount++;
            const delay = Math.min(pollDelay * 1.2, MAX_WAIT_TIME);
            await new Promise(resolve => setTimeout(resolve, delay));
            return performCheck(delay);
          }
        } catch (err) {
          console.error('Error checking translation status:', err);
          setLoadStatus('⚠️ Lỗi kiểm tra. Cố gắng tải model...');
          return true;
        }
      };

      return performCheck(3000);
    },
    [token, requestTranslation]
  );

  const loadModelRef = useRef<(viewer: Autodesk.Viewing.GuiViewer3D, modelUrn: string) => Promise<void>>(async () => {});

  // Define load model function
  const loadModel = useCallback(async (viewer: Autodesk.Viewing.GuiViewer3D, modelUrn: string) => {
    // Extract the base64-encoded URN
    let encodedUrn = modelUrn;
    if (modelUrn.startsWith('urn:')) {
      encodedUrn = modelUrn.substring(4); // Remove 'urn:' prefix for API calls
    }

    const documentId = modelUrn.startsWith('urn:') ? modelUrn : 'urn:' + modelUrn;

    console.log('AutodeskViewer is attempting to load model with documentId:', documentId);
    console.log('Raw modelUrn passed:', modelUrn);
    console.log('Encoded URN for API:', encodedUrn);

    // Check translation status via polling
    const isReady = await checkTranslationStatus(encodedUrn);
    
    if (!isReady) {
      console.warn('Model translation may still be in progress. Attempting to load anyway in 10 seconds...');
      setLoadStatus('⏳ Model chưa sẵn sàng hoàn toàn. Tải lại sau...');
      // Set a timeout to retry loading after translation completes
      setTimeout(() => {
        if (viewerInstanceRef.current && loadModelRef.current) {
          void loadModelRef.current(viewerInstanceRef.current, modelUrn);
        }
      }, 10000);
      return;
    }

    setLoadStatus('⏳ Loading 3D model...');

    // Unload the current model if loaded to prepare for the new one
    if (viewer.model) {
      console.log('Unloading previous model...');
      viewer.tearDown();
      viewer.setUp(viewer.config);
    }

    Autodesk.Viewing.Document.load(
      documentId,
      (doc) => {
        console.log('Autodesk document loaded successfully! Root node:', doc.getRoot());
        setLoadStatus('');
        const viewable = doc.getRoot().search({ type: 'geometry', role: '3d' })[0];
        if (viewable) {
          console.log('Found 3D geometry node, loading it into viewer:', viewable);
          viewer.loadDocumentNode(doc, viewable);
        } else {
          console.warn('No 3D geometry found. Searching for 2D geometry...');
          const viewable2d = doc.getRoot().search({ type: 'geometry', role: '2d' })[0];
          if (viewable2d) {
            console.log('Found 2D geometry node, loading it:', viewable2d);
            viewer.loadDocumentNode(doc, viewable2d);
          } else {
            console.error('No 3D or 2D geometry found in document');
            setLoadStatus('❌ Không tìm thấy geometry 3D hoặc 2D trong model này.');
          }
        }
      },
      (errorCode: number, errorMsg: string) => {
        console.error('Failed to load document. Error code:', errorCode);
        console.error('Error message:', errorMsg);
        
        // If 404, model might still be translating - retry
        if (errorCode === 404) {
          console.log('Document not yet available (404). Retrying in 15 seconds...');
          setLoadStatus('⏳ Model còn đang chuyển đổi. Tải lại sau...');
          setTimeout(() => {
            if (viewerInstanceRef.current && loadModelRef.current) {
              void loadModelRef.current(viewerInstanceRef.current, modelUrn);
            }
          }, 15000);
        } else {
          setLoadStatus(`❌ Load failed (code: ${errorCode}). ${errorMsg || ''}`);
        }
      }
    );
  }, [checkTranslationStatus]);

  // Keep ref up to date
  useEffect(() => {
    loadModelRef.current = loadModel;
  }, [loadModel]);

  // Initialize viewer
  useEffect(() => {
    if (!token || !viewerRef.current) return;

    const options = {
      env: 'AutodeskProduction',
      accessToken: token,
    };

    let viewer: Autodesk.Viewing.GuiViewer3D | null = null;

    Autodesk.Viewing.Initializer(options, () => {
      if (!viewerRef.current) return;

      // Initialize the viewer
      viewer = new Autodesk.Viewing.GuiViewer3D(viewerRef.current);
      viewer.start();
      viewerInstanceRef.current = viewer;

      if (urn) {
        loadModel(viewer, urn);
      }
    });

    return () => {
      if (viewer) {
        viewer.finish();
        viewerInstanceRef.current = null;
      }
    };
  }, [token, loadModel, urn]);

  // Handle URN updates
  useEffect(() => {
    const viewer = viewerInstanceRef.current;
    if (viewer && urn) {
      loadModel(viewer, urn);
    }
  }, [urn, loadModel]);

  if (!token) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: '600px',
          border: '1px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontFamily: 'Outfit', fontWeight: 600 }}>
          Autodesk Model Viewer
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 320, fontFamily: 'Outfit' }}>
          Connect to Autodesk Construction Cloud to view the integrated 3D model.
        </Typography>
        <Button variant="contained" color="primary" onClick={onConnect} sx={{ borderRadius: 2, textTransform: 'none', px: 4, py: 1, fontFamily: 'Outfit', fontWeight: 600 }}>
          Connect Autodesk
        </Button>
      </Box>
    );
  }

  if (!urn) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: '600px',
          border: '1px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Outfit', fontWeight: 500 }}>
          No model selected
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 320, fontFamily: 'Outfit' }}>
          Select a file version from the Autodesk ACC Browser on the left to display its 3D model.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: '#0b0f19',
      }}
    >
      {/* Loading status overlay — full centered */}
      {loadStatus && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Spinner ring (only when not error/success) */}
          {!loadStatus.includes('❌') && !loadStatus.includes('✅') && (
            <Box
              sx={{
                width: 56,
                height: 56,
                mb: 3,
                border: '3px solid rgba(99, 102, 241, 0.15)',
                borderTopColor: '#818cf8',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          )}

          {/* Status icon for error / success */}
          {loadStatus.includes('✅') && (
            <Box sx={{ fontSize: 48, mb: 2 }}>✅</Box>
          )}
          {loadStatus.includes('❌') && (
            <Box sx={{ fontSize: 48, mb: 2 }}>❌</Box>
          )}

          {/* Status text */}
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Outfit',
              color: loadStatus.includes('❌') ? '#f87171' : loadStatus.includes('✅') ? '#34d399' : '#e0e7ff',
              fontWeight: 600,
              fontSize: '1rem',
              textAlign: 'center',
              maxWidth: 400,
              px: 2,
            }}
          >
            {loadStatus}
          </Typography>

          {/* Progress bar */}
          {!loadStatus.includes('❌') && !loadStatus.includes('✅') && (
            <LinearProgress
              sx={{
                mt: 3,
                width: 260,
                height: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#818cf8',
                },
              }}
            />
          )}
        </Box>
      )}
      <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
};
export default AutodeskViewer;
