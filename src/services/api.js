import { INITIAL_USERS } from '../data/users';
import { INITIAL_BINS } from '../data/bins';
import { INITIAL_DRIVERS } from '../data/drivers';
import { INITIAL_NOTIFICATIONS } from '../data/notifications';

const STORAGE_KEYS = {
  CURRENT_USER: 'smartwaste_current_user',
  BINS: 'smartwaste_bins',
  DRIVERS: 'smartwaste_drivers',
  NOTIFICATIONS: 'smartwaste_notifications'
};

function getStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Storage parse error:', e);
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage set error:', e);
  }
}

// Initialize default data if not present
if (!localStorage.getItem(STORAGE_KEYS.BINS)) {
  setStorage(STORAGE_KEYS.BINS, INITIAL_BINS);
}
if (!localStorage.getItem(STORAGE_KEYS.DRIVERS)) {
  setStorage(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
}
if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
  setStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export const authService = {
  login: async (email, password) => {
    const user = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password. Please use demo credentials.');
    }
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return user;
  },

  loginAsRole: async (role) => {
    const user = INITIAL_USERS.find((u) => u.role === role);
    if (!user) throw new Error(`User for role ${role} not found.`);
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return user;
  },

  getCurrentUser: () => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  logout: () => {
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const binService = {
  getBins: () => {
    return getStorage(STORAGE_KEYS.BINS, INITIAL_BINS);
  },

  getBinById: (id) => {
    const bins = getStorage(STORAGE_KEYS.BINS, INITIAL_BINS);
    return bins.find((b) => b.id === id) || null;
  },

  updateBin: (id, updates) => {
    const bins = getStorage(STORAGE_KEYS.BINS, INITIAL_BINS);
    const updated = bins.map((b) => {
      if (b.id === id) {
        const newBin = { ...b, ...updates };
        // compute status if fillLevel changed
        if (typeof updates.fillLevel === 'number') {
          if (newBin.fillLevel >= 90) newBin.status = 'CRITICAL';
          else if (newBin.fillLevel >= 75) newBin.status = 'WARNING';
          else newBin.status = 'NORMAL';
        }
        return newBin;
      }
      return b;
    });
    setStorage(STORAGE_KEYS.BINS, updated);
    return updated.find((b) => b.id === id);
  },

  addBin: (binData) => {
    const bins = getStorage(STORAGE_KEYS.BINS, INITIAL_BINS);
    const newBin = {
      id: `BIN-${Math.floor(100 + Math.random() * 900)}`,
      status: binData.fillLevel >= 90 ? 'CRITICAL' : binData.fillLevel >= 75 ? 'WARNING' : 'NORMAL',
      battery: 100,
      temperature: 22.5,
      humidity: 50,
      tiltAngle: 0.2,
      gasPpm: 10,
      rssi: -55,
      esp32Mac: `24:6F:28:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
      firmware: 'v2.4.1-esp32',
      lastEmptied: 'Just now',
      lastTelemetry: 'Live',
      coords: { x: Math.floor(20 + Math.random() * 60), y: Math.floor(20 + Math.random() * 60) },
      needsMaintenance: false,
      collectionRequested: binData.fillLevel >= 80,
      ...binData
    };
    bins.unshift(newBin);
    setStorage(STORAGE_KEYS.BINS, bins);
    return newBin;
  },

  markCollected: (binId, driverId) => {
    const bins = getStorage(STORAGE_KEYS.BINS, INITIAL_BINS);
    const updated = bins.map((b) => {
      if (b.id === binId) {
        return {
          ...b,
          fillLevel: 5,
          currentLiters: Math.round(b.capacityLiters * 0.05),
          status: 'NORMAL',
          collectionRequested: false,
          lastEmptied: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return b;
    });
    setStorage(STORAGE_KEYS.BINS, updated);

    // Update driver collections completed count if driverId provided
    if (driverId) {
      const drivers = getStorage(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
      const updatedDrivers = drivers.map((d) => {
        if (d.id === driverId) {
          return {
            ...d,
            collectionsCompleted: d.collectionsCompleted + 1,
            assignedBins: d.assignedBins.filter((id) => id !== binId)
          };
        }
        return d;
      });
      setStorage(STORAGE_KEYS.DRIVERS, updatedDrivers);
    }
  },

  requestCollection: (binId) => {
    const bins = getStorage(STORAGE_KEYS.BINS, INITIAL_BINS);
    const updated = bins.map((b) => (b.id === binId ? { ...b, collectionRequested: true } : b));
    setStorage(STORAGE_KEYS.BINS, updated);
  },

  resolveMaintenance: (binId) => {
    const bins = getStorage(STORAGE_KEYS.BINS, INITIAL_BINS);
    const updated = bins.map((b) =>
      b.id === binId
        ? { ...b, needsMaintenance: false, battery: 100, tiltAngle: 0.5, status: b.fillLevel >= 90 ? 'CRITICAL' : 'NORMAL' }
        : b
    );
    setStorage(STORAGE_KEYS.BINS, updated);
  }
};

export const driverService = {
  getDrivers: () => {
    return getStorage(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
  },

  getDriverById: (id) => {
    const drivers = getStorage(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
    return drivers.find((d) => d.id === id) || null;
  },

  updateDriverStatus: (id, status) => {
    const drivers = getStorage(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
    const updated = drivers.map((d) => (d.id === id ? { ...d, status } : d));
    setStorage(STORAGE_KEYS.DRIVERS, updated);
  },

  assignBinToDriver: (driverId, binId) => {
    const drivers = getStorage(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
    const updatedDrivers = drivers.map((d) => {
      if (d.id === driverId && !d.assignedBins.includes(binId)) {
        return { ...d, assignedBins: [...d.assignedBins, binId] };
      }
      return d;
    });
    setStorage(STORAGE_KEYS.DRIVERS, updatedDrivers);

    // Also link bin to driver
    const bins = getStorage(STORAGE_KEYS.BINS, INITIAL_BINS);
    const updatedBins = bins.map((b) => (b.id === binId ? { ...b, assignedDriverId: driverId, collectionRequested: true } : b));
    setStorage(STORAGE_KEYS.BINS, updatedBins);
  }
};

export const notificationService = {
  getNotifications: (role) => {
    const notifs = getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!role || role === 'ADMIN') return notifs;
    return notifs.filter((n) => n.targetRole === 'ALL' || n.targetRole === role);
  },

  markAsRead: (id) => {
    const notifs = getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  addNotification: (notif) => {
    const notifs = getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
      ...notif
    };
    notifs.unshift(newNotif);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return newNotif;
  }
};
