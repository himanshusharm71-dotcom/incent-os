import React, { useEffect, useRef } from 'react';
import { X, Mic, Video, PhoneOff } from 'lucide-react';

/**
 * JitsiRoom — embeds a real video meeting inside the website.
 * Uses Jitsi Meet (free, no API key needed).
 */
function JitsiRoom({ roomName, displayName, onClose }) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    // Load Jitsi Meet External API script dynamically
    const scriptId = 'jitsi-api-script';
    const loadJitsi = () => {
      if (apiRef.current) return; // already loaded

      apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName: roomName,
        parentNode: containerRef.current,
        width: '100%',
        height: '100%',
        userInfo: {
          displayName: displayName || 'Guest',
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
          prejoinPageEnabled: false,
          enableWelcomePage: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop',
            'fullscreen', 'fodeviceselection', 'hangup', 'chat',
            'recording', 'livestreaming', 'etherpad', 'sharedvideo',
            'settings', 'raisehand', 'videoquality', 'filmstrip',
            'participants-pane', 'tileview',
          ],
        },
      });

      // Close when user hangs up
      apiRef.current.addEventListener('readyToClose', () => {
        onClose();
      });
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = loadJitsi;
      document.body.appendChild(script);
    } else if (window.JitsiMeetExternalAPI) {
      loadJitsi();
    } else {
      // Script already in DOM but still loading — wait
      const interval = setInterval(() => {
        if (window.JitsiMeetExternalAPI) {
          clearInterval(interval);
          loadJitsi();
        }
      }, 200);
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [roomName]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#1a1a2e',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        background: 'rgba(0,0,0,0.4)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#10B981', boxShadow: '0 0 8px #10B981',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '1rem' }}>
            🎥 {roomName.replace(/incent-os-/g, '').replace(/-/g, ' ')}
          </span>
          <span style={{
            fontSize: '0.72rem', padding: '2px 10px', borderRadius: '20px',
            background: 'rgba(16,185,129,0.2)', color: '#10B981',
            border: '1px solid rgba(16,185,129,0.3)', fontWeight: '600',
          }}>LIVE</span>
        </div>
        <button
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '20px',
            background: '#EF4444', border: 'none',
            color: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem',
          }}
        >
          <PhoneOff size={15} /> Leave Meeting
        </button>
      </div>

      {/* Jitsi Embed */}
      <div ref={containerRef} style={{ flex: 1, minHeight: 0 }} />
    </div>
  );
}

export default JitsiRoom;
