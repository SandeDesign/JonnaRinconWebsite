import {
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  getDoc,
  Timestamp,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config';
import { Purchase } from '../types';

class PurchaseService {
  private collectionName = 'purchases';

  /**
   * Generate a unique product number
   * Format: PROD-YYYY-XXXXX
   */
  private generateProductNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, '0');
    return `PROD-${year}-${random}`;
  }

  /**
   * Create download links with expiry date (30 days)
   */
  private createDownloadLinks(audioUrl: string, stemsUrl?: string) {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const expiryTimestamp = Timestamp.fromDate(expiryDate);

    const links: any = {};

    if (audioUrl) {
      links.wav = {
        url: audioUrl,
        expiresAt: expiryTimestamp,
      };
    }

    if (stemsUrl) {
      links.stems = {
        url: stemsUrl,
        expiresAt: expiryTimestamp,
      };
    }

    // Contract link (placeholder for future)
    links.contract = {
      url: '', // Will be filled when contract system is ready
      expiresAt: expiryTimestamp,
    };

    return links;
  }

  /**
   * Create a new purchase record
   */
  async createPurchase(data: {
    userId: string;
    beatId: string;
    beatTitle: string;
    beatArtist: string;
    artworkUrl: string;
    audioUrl: string;
    stemsUrl?: string;
    licenseType: 'basic' | 'premium' | 'exclusive';
    price: number;
  }): Promise<Purchase> {
    try {
      const productNumber = this.generateProductNumber();
      const downloadLinks = this.createDownloadLinks(data.audioUrl, data.stemsUrl);
      const expiresAt = Timestamp.fromDate(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );

      const purchaseData = {
        productNumber,
        userId: data.userId,
        beatId: data.beatId,
        beatTitle: data.beatTitle,
        beatArtist: data.beatArtist,
        artworkUrl: data.artworkUrl,
        audioUrl: data.audioUrl,
        stemsUrl: data.stemsUrl || null,
        licenseType: data.licenseType,
        price: data.price,
        downloadLinks,
        status: 'completed' as const,
        createdAt: serverTimestamp(),
        expiresAt,
      };

      const docRef = await addDoc(
        collection(db, this.collectionName),
        purchaseData
      );

      return {
        id: docRef.id,
        ...purchaseData,
        createdAt: Timestamp.now(),
        expiresAt,
      } as Purchase;
    } catch (error: any) {
      console.error('Create purchase error:', error);
      throw new Error(error.message || 'Failed to create purchase');
    }
  }

  /**
   * Get all purchases for a user
   */
  async getUserPurchases(userId: string): Promise<Purchase[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Purchase[];
    } catch (error: any) {
      console.error('Get user purchases error:', error);
      throw new Error(error.message || 'Failed to fetch purchases');
    }
  }

  /**
   * Get a single purchase by ID
   */
  async getPurchase(purchaseId: string): Promise<Purchase | null> {
    try {
      const docRef = doc(db, this.collectionName, purchaseId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Purchase;
      }

      return null;
    } catch (error: any) {
      console.error('Get purchase error:', error);
      throw new Error(error.message || 'Failed to fetch purchase');
    }
  }

  /**
   * Get purchases for a specific beat (for tracking sales)
   */
  async getBeatPurchases(beatId: string): Promise<Purchase[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('beatId', '==', beatId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Purchase[];
    } catch (error: any) {
      console.error('Get beat purchases error:', error);
      throw new Error(error.message || 'Failed to fetch beat purchases');
    }
  }

  /**
   * Update purchase status (e.g., mark as expired)
   */
  async updatePurchaseStatus(
    purchaseId: string,
    status: 'pending' | 'completed' | 'expired'
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, purchaseId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Update purchase status error:', error);
      throw new Error(error.message || 'Failed to update purchase');
    }
  }

  /**
   * Update download link (for future contract system)
   */
  async updateDownloadLink(
    purchaseId: string,
    linkType: 'wav' | 'stems' | 'contract',
    url: string
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, purchaseId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Purchase not found');
      }

      const currentLinks = docSnap.data().downloadLinks || {};
      currentLinks[linkType] = {
        url,
        expiresAt: currentLinks[linkType]?.expiresAt || Timestamp.now(),
      };

      await updateDoc(docRef, {
        downloadLinks: currentLinks,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Update download link error:', error);
      throw new Error(error.message || 'Failed to update download link');
    }
  }

  /**
   * Check if a download link has expired
   */
  isDownloadExpired(expiresAt: Timestamp): boolean {
    const expiryDate = expiresAt.toDate();
    return new Date() > expiryDate;
  }

  /**
   * Get time remaining until expiry (in days)
   */
  getDaysUntilExpiry(expiresAt: Timestamp): number {
    const expiryDate = expiresAt.toDate();
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}

export const purchaseService = new PurchaseService();
