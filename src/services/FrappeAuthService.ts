/**
 * Frappe API Service for Soul Place Patient App
 * Handles authentication and user management
 */

const FRAPPE_BASE_URL = process.env.REACT_APP_FRAPPE_URL || 'http://localhost:8000';

interface FrappeResponse<T> {
  message: T;
  exc?: string;
}

interface AuthResponse {
  user: string;
  sid: string;
  full_name: string;
}

interface OtpResponse {
  otp_id: string;
  message: string;
}

class FrappeAuthService {
  /**
   * Send OTP to mobile number
   */
  static async sendOtp(mobileNumber: string): Promise<OtpResponse> {
    try {
      const response = await fetch(`${FRAPPE_BASE_URL}/api/method/soul_place.auth.send_otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': await this.getCsrfToken(),
        },
        body: JSON.stringify({
          mobile_number: mobileNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send OTP: ${response.statusText}`);
      }

      const data: FrappeResponse<OtpResponse> = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  /**
   * Verify OTP and sign up new user
   */
  static async signupWithOtp(
    mobileNumber: string,
    otp: string,
    userData: {
      name: string;
      age: number;
      gender: string;
      living_status: 'family' | 'alone';
      therapy_experience: boolean;
    }
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${FRAPPE_BASE_URL}/api/method/soul_place.auth.verify_otp_and_signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': await this.getCsrfToken(),
        },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          otp,
          user_data: userData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Signup failed: ${response.statusText}`);
      }

      const data: FrappeResponse<AuthResponse> = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error during signup with OTP:', error);
      throw error;
    }
  }

  /**
   * Verify OTP for login
   */
  static async loginWithOtp(mobileNumber: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${FRAPPE_BASE_URL}/api/method/soul_place.auth.verify_otp_and_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': await this.getCsrfToken(),
        },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          otp,
        }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data: FrappeResponse<AuthResponse> = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error during login with OTP:', error);
      throw error;
    }
  }

  /**
   * Traditional login with mobile number and password
   */
  static async loginWithPassword(mobileNumber: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${FRAPPE_BASE_URL}/api/method/soul_place.auth.login_with_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': await this.getCsrfToken(),
        },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

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
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': await this.getCsrfToken(),
        },
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
