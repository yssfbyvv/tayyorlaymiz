// Real online presence service
const PRESENCE_STORAGE_KEY = 'te_real_presence_sessions_v1';

let sessionId: string | null = null;
const listeners = new Set<(count: number) => void>();
let currentCount = 1;

function getSessionId(): string {
  if (sessionId) return sessionId;
  try {
    const existing = sessionStorage.getItem('te_session_id');
    if (existing) {
      sessionId = existing;
      return existing;
    }
    const created = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    sessionStorage.setItem('te_session_id', created);
    sessionId = created;
    return created;
  } catch {
    return 'sess_fallback_' + Date.now();
  }
}

function updateLocalRegistry(): number {
  try {
    const sid = getSessionId();
    const now = Date.now();
    const raw = localStorage.getItem(PRESENCE_STORAGE_KEY);
    const sessions: Record<string, number> = raw ? JSON.parse(raw) : {};

    // Register this session
    sessions[sid] = now;

    // Prune stale sessions older than 12 seconds
    for (const [id, lastSeen] of Object.entries(sessions)) {
      if (now - lastSeen > 12000) {
        delete sessions[id];
      }
    }

    localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(sessions));
    return Math.max(1, Object.keys(sessions).length);
  } catch {
    return 1;
  }
}

function removeCurrentSession() {
  try {
    const sid = getSessionId();
    const raw = localStorage.getItem(PRESENCE_STORAGE_KEY);
    if (raw) {
      const sessions: Record<string, number> = JSON.parse(raw);
      delete sessions[sid];
      localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(sessions));
    }

    // Ping server with beacon on exit
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify({ sessionId: sid })], { type: 'application/json' });
      navigator.sendBeacon('/api/presence/leave', blob);
    }
  } catch {
    // Ignore error on unload
  }
}

// Perform heartbeat ping
async function sendHeartbeat() {
  const localCount = updateLocalRegistry();
  const sid = getSessionId();

  try {
    const res = await fetch('/api/presence/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sid }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.count === 'number') {
        notifyListeners(data.count);
        return;
      }
    }
  } catch {
    // If backend unavailable, use local cross-tab count
  }

  notifyListeners(localCount);
}

function notifyListeners(count: number) {
  currentCount = count;
  listeners.forEach((listener) => {
    try {
      listener(count);
    } catch {
      // Ignore listener error
    }
  });
}

// Initialize presence engine
let isInitialized = false;

export const PresenceService = {
  init() {
    if (isInitialized || typeof window === 'undefined') return;
    isInitialized = true;

    // Send immediate initial heartbeat
    sendHeartbeat();

    // Regular heartbeat interval every 4 seconds
    const interval = setInterval(() => {
      sendHeartbeat();
    }, 4000);

    // Listen to storage events from other tabs to sync immediately
    window.addEventListener('storage', (e) => {
      if (e.key === PRESENCE_STORAGE_KEY) {
        try {
          const sessions = e.newValue ? JSON.parse(e.newValue) : {};
          const count = Math.max(1, Object.keys(sessions).length);
          notifyListeners(count);
        } catch {
          // Ignore parse error
        }
      }
    });

    // Cleanup on window unload/close
    window.addEventListener('beforeunload', () => {
      removeCurrentSession();
    });

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    });

    return () => clearInterval(interval);
  },

  getCurrentCount(): number {
    return currentCount;
  },

  subscribe(listener: (count: number) => void): () => void {
    listeners.add(listener);
    listener(currentCount);
    return () => {
      listeners.delete(listener);
    };
  },
};
