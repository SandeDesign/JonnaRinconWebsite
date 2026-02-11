import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config';
import { authService } from './authService';

export interface ShopSettings {
  storeName: string;
  storeDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  featuredEnabled: boolean;
  trendingEnabled: boolean;
  genres: string[];
  currency: string;
  taxRate: number;
  enableDownloads: boolean;
  watermarkPreviews: boolean;
  updatedAt?: any;
  updatedBy?: string;
}

export interface GeneralSettings {
  platformName: string;
  supportEmail: string;
  websiteUrl: string;
  timezone: string;
  language: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface NotificationSettings {
  emailOrderNotifications: boolean;
  emailCollaborationNotifications: boolean;
  emailAnalyticsReports: boolean;
  emailSecurityAlerts: boolean;
  emailNewFeatures: boolean;
  pushNotifications: boolean;
  updatedAt?: any;
  updatedBy?: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordMinLength: number;
  sessionTimeout: number;
  enableAutoBackup: boolean;
  backupFrequency: string;
  updatedAt?: any;
  updatedBy?: string;
}

class SettingsService {
  private collectionName = 'settings';

  async getShopSettings(): Promise<ShopSettings | null> {
    try {
      const docRef = doc(db, this.collectionName, 'shop');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as ShopSettings;
      }
      return null;
    } catch (error: any) {
      console.error('Get shop settings error:', error);
      throw new Error(error.message || 'Failed to get shop settings');
    }
  }

  async saveShopSettings(settings: ShopSettings): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can save settings');
    }

    try {
      const docRef = doc(db, this.collectionName, 'shop');
      const settingsWithMeta = {
        ...settings,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      };

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, settingsWithMeta);
      } else {
        await setDoc(docRef, settingsWithMeta);
      }
    } catch (error: any) {
      console.error('Save shop settings error:', error);
      throw new Error(error.message || 'Failed to save shop settings');
    }
  }

  async getGeneralSettings(): Promise<GeneralSettings | null> {
    try {
      const docRef = doc(db, this.collectionName, 'general');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as GeneralSettings;
      }
      return null;
    } catch (error: any) {
      console.error('Get general settings error:', error);
      throw new Error(error.message || 'Failed to get general settings');
    }
  }

  async saveGeneralSettings(settings: GeneralSettings): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can save settings');
    }

    try {
      const docRef = doc(db, this.collectionName, 'general');
      const settingsWithMeta = {
        ...settings,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      };

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, settingsWithMeta);
      } else {
        await setDoc(docRef, settingsWithMeta);
      }
    } catch (error: any) {
      console.error('Save general settings error:', error);
      throw new Error(error.message || 'Failed to save general settings');
    }
  }

  async getNotificationSettings(): Promise<NotificationSettings | null> {
    try {
      const docRef = doc(db, this.collectionName, 'notifications');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as NotificationSettings;
      }
      return null;
    } catch (error: any) {
      console.error('Get notification settings error:', error);
      throw new Error(error.message || 'Failed to get notification settings');
    }
  }

  async saveNotificationSettings(settings: NotificationSettings): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can save settings');
    }

    try {
      const docRef = doc(db, this.collectionName, 'notifications');
      const settingsWithMeta = {
        ...settings,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      };

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, settingsWithMeta);
      } else {
        await setDoc(docRef, settingsWithMeta);
      }
    } catch (error: any) {
      console.error('Save notification settings error:', error);
      throw new Error(error.message || 'Failed to save notification settings');
    }
  }

  async getSecuritySettings(): Promise<SecuritySettings | null> {
    try {
      const docRef = doc(db, this.collectionName, 'security');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as SecuritySettings;
      }
      return null;
    } catch (error: any) {
      console.error('Get security settings error:', error);
      throw new Error(error.message || 'Failed to get security settings');
    }
  }

  async saveSecuritySettings(settings: SecuritySettings): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can save settings');
    }

    try {
      const docRef = doc(db, this.collectionName, 'security');
      const settingsWithMeta = {
        ...settings,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      };

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, settingsWithMeta);
      } else {
        await setDoc(docRef, settingsWithMeta);
      }
    } catch (error: any) {
      console.error('Save security settings error:', error);
      throw new Error(error.message || 'Failed to save security settings');
    }
  }
}

export const settingsService = new SettingsService();
