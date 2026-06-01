/**
 * Frappe API Service for Soul Place Patient App (password-only)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const FRAPPE_BASE_URL = process.env.EXPO_PUBLIC_FRAPPE_URL || process.env.REACT_APP_FRAPPE_URL || 'http://localhost:8000';

interface FrappeResponse<T> {
  message: T;
  exc?: string;
}

interface AuthResponse {
  user: string;
  sid: string;
  full_name: string;
}

interface LocalAccount {
  mobileNumber: string;
  password: string;
  fullName: string;
}

class FrappeAuthService {
  private static readonly ACCOUNT_PREFIX = '@soulplace/account/';

  private static normalizeMobileNumber(mobileNumber: string): string {
    return mobileNumber.trim().replace(/\s+/g, '');
  }

  private static getAccountKey(mobileNumber: string): string {
    return `${this.ACCOUNT_PREFIX}${this.normalizeMobileNumber(mobileNumber)}`;
  }

  static async saveLocalAccount(account: LocalAccount): Promise<void> {
    await AsyncStorage.setItem(
      this.getAccountKey(account.mobileNumber),
      JSON.stringify({
        ...account,
        mobileNumber: this.normalizeMobileNumber(account.mobileNumber),
      }),
    );
  }

  private static async getLocalAccount(mobileNumber: string): Promise<LocalAccount | null> {
    const storedValue = await AsyncStorage.getItem(this.getAccountKey(mobileNumber));
    if (!storedValue) {
      return null;
    }

    try {
      return JSON.parse(storedValue) as LocalAccount;
    } catch {
      return null;
    }
  }

  /**
   * Request OTP for login
   */
  static async requestOtp(mobileNumber: string): Promise<void> {
    const normalizedMobile = this.normalizeMobileNumber(mobileNumber);
    try {
      const response = await fetch(`${FRAPPE_BASE_URL}/api/method/soul_place.api.send_otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': await this.getCsrfToken() },
        body: JSON.stringify({ mobile_number: normalizedMobile }),
      });
      if (!response.ok) {
        console.warn('Backend OTP generation failed or not configured. Mocking success for development.');
        return;
      }
    } catch (error) {
      console.warn('Error requesting OTP. Mocking success for development:', error);
    }
  }

  /**
   * Verify OTP and login
   */
  static async loginWithOtp(mobileNumber: string, otp: string): Promise<AuthResponse> {
    const normalizedMobile = this.normalizeMobileNumber(mobileNumber);
    try {
      const response = await fetch(`${FRAPPE_BASE_URL}/api/method/soul_place.api.verify_otp_and_login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': await this.getCsrfToken() },
        body: JSON.stringify({ mobile_number: normalizedMobile, otp }),
      });

      if (!response.ok) {
        console.warn('Backend OTP verification failed. Using local mock login.');
        return this.mockOtpLogin(normalizedMobile, otp);
      }

      const data: FrappeResponse<AuthResponse> = await response.json();
      return data.message;
    } catch (error) {
      console.warn('Error during OTP verification. Using local mock login.', error);
      return this.mockOtpLogin(normalizedMobile, otp);
    }
  }

  private static async mockOtpLogin(mobileNumber: string, otp: string): Promise<AuthResponse> {
    if (otp !== '123456') {
      throw new Error('Invalid OTP. Use 123456 for testing.');
    }
    const localAccount = await this.getLocalAccount(mobileNumber);
    return {
      user: mobileNumber,
      sid: `mock-otp-session-${mobileNumber}`,
      full_name: localAccount?.fullName || mobileNumber,
    };
  }

  /**
   * Traditional login with mobile number and password
   */
  static async loginWithPassword(mobileNumber: string, password: string): Promise<AuthResponse> {
    const normalizedMobile = this.normalizeMobileNumber(mobileNumber);
    const localAccount = await this.getLocalAccount(normalizedMobile);

    if (localAccount) {
      if (localAccount.password !== password) {
        throw new Error('Incorrect password for this account.');
      }

      return {
        user: normalizedMobile,
        sid: `local-session-${normalizedMobile}`,
        full_name: localAccount.fullName,
      };
    }

    try {
      const response = await fetch(`${FRAPPE_BASE_URL}/api/method/soul_place.auth.login_with_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': await this.getCsrfToken(),
        },
        body: JSON.stringify({ mobile_number: normalizedMobile, password }),
      });

      if (!response.ok) throw new Error(`Login failed: ${response.statusText}`);

      const data: FrappeResponse<AuthResponse> = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error during password login:', error);
      throw error;
    }
  }

  /**
   * Get CSRF token from Frappe
   */
  private static async getCsrfToken(): Promise<string> {
    try {
      const response = await fetch(`${FRAPPE_BASE_URL}/api/method/frappe.auth.get_csrf_token`);
      const data = await response.json();
      return data.message || '';
    } catch (error) {
      console.error('Error getting CSRF token:', error);
      return '';
    }
  }

  /**
   * Logout current user
   */
  static async logout(): Promise<void> {
    try {
      await fetch(`${FRAPPE_BASE_URL}/api/method/frappe.auth.logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Frappe-CSRF-Token': await this.getCsrfToken() },
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  /**
   * Get current user information
   */
  static async getCurrentUser(): Promise<any> {
    try {
      const response = await fetch(`${FRAPPE_BASE_URL}/api/resource/User`);
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}

export default FrappeAuthService;
