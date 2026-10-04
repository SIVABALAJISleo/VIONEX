/**
 * VIONEX Zero-Tracking Privacy & Cookie Consent Manager
 * Implements strict Zero-Tracking for anonymous visitors before explicit consent.
 * Complies with GDPR, ePrivacy Directive, and CCPA requirements.
 */

export interface ConsentPreferences {
  strictlyNecessary: boolean; // Always true
  functionalAnalytics: boolean;
  performanceP2P: boolean;
  personalizedRecommendations: boolean;
  consentTimestamp: string | null;
  consentGiven: boolean;
}

const STORAGE_KEY = 'vionex_cookie_consent_v1';

export const DEFAULT_CONSENT: ConsentPreferences = {
  strictlyNecessary: true,
  functionalAnalytics: false,
  performanceP2P: false,
  personalizedRecommendations: false,
  consentTimestamp: null,
  consentGiven: false,
};

export class PrivacyConsentManager {
  private static instance: PrivacyConsentManager;
  private currentPreferences: ConsentPreferences = DEFAULT_CONSENT;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadPreferences();
    }
  }

  public static getInstance(): PrivacyConsentManager {
    if (!PrivacyConsentManager.instance) {
      PrivacyConsentManager.instance = new PrivacyConsentManager();
    }
    return PrivacyConsentManager.instance;
  }

  /**
   * Load stored preferences or enforce strict zero-tracking by default
   */
  public loadPreferences(): ConsentPreferences {
    if (typeof window === 'undefined') return DEFAULT_CONSENT;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.currentPreferences = JSON.parse(stored);
      } else {
        // Strict Zero-Tracking Mode Active: Purge any non-essential cookies
        this.currentPreferences = { ...DEFAULT_CONSENT };
        this.sanitizeCookies();
      }
    } catch {
      this.currentPreferences = { ...DEFAULT_CONSENT };
    }
    return this.currentPreferences;
  }

  /**
   * Grant consent for optional categories
   */
  public updateConsent(updates: Partial<Omit<ConsentPreferences, 'strictlyNecessary' | 'consentTimestamp' | 'consentGiven'>>): ConsentPreferences {
    this.currentPreferences = {
      ...this.currentPreferences,
      ...updates,
      strictlyNecessary: true,
      consentTimestamp: new Date().toISOString(),
      consentGiven: true,
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentPreferences));
      } catch {
        // localStorage unavailable
      }
    }
    return this.currentPreferences;
  }

  /**
   * Reject all optional cookies (Enforce Zero-Tracking)
   */
  public rejectAll(): ConsentPreferences {
    this.currentPreferences = {
      strictlyNecessary: true,
      functionalAnalytics: false,
      performanceP2P: false,
      personalizedRecommendations: false,
      consentTimestamp: new Date().toISOString(),
      consentGiven: true,
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentPreferences));
        this.sanitizeCookies();
      } catch {
        // localStorage unavailable
      }
    }
    return this.currentPreferences;
  }

  /**
   * Accept all standard platform cookies
   */
  public acceptAll(): ConsentPreferences {
    return this.updateConsent({
      functionalAnalytics: true,
      performanceP2P: true,
      personalizedRecommendations: true,
    });
  }

  public hasConsentBeenDetermined(): boolean {
    return this.currentPreferences.consentGiven;
  }

  public isTrackingAllowed(): boolean {
    return this.currentPreferences.functionalAnalytics && this.currentPreferences.consentGiven;
  }

  /**
   * Remove any third-party or non-whitelisted tracking cookies in zero-tracking mode
   */
  private sanitizeCookies(): void {
    if (typeof document === 'undefined') return;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      // Whitelist only essential session cookies
      const isEssential = name.startsWith('vionex-session') || name.startsWith('vionex-csrf');
      if (!isEssential && name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
      }
    }
  }
}

export const privacyManager = PrivacyConsentManager.getInstance();
