import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '757435269197-faksmrism90tgvhfj9p8v0k4ldgmirrc.apps.googleusercontent.com',
});

/**
 * Service to handle Firebase Authentication operations
 * Uses the Native @react-native-firebase/auth SDK
 */
export class FirebaseAuthService {
  /**
   * Requests an OTP to be sent to the given mobile number via Firebase.
   * Returns a confirmation object that must be used to verify the code.
   */
  static async requestOtp(mobileNumber: string): Promise<FirebaseAuthTypes.ConfirmationResult> {
    // Ensure the number has the country code
    const formattedNumber = mobileNumber.startsWith('+') ? mobileNumber : `+91${mobileNumber}`;
    
    try {
      const confirmation = await auth().signInWithPhoneNumber(formattedNumber);
      return confirmation;
    } catch (error) {
      console.error('Firebase OTP Request Error:', error);
      throw new Error('Failed to send OTP. Please try again.');
    }
  }

  /**
   * Verifies the OTP code typed by the user against the Firebase confirmation object.
   */
  static async verifyOtp(
    confirmation: FirebaseAuthTypes.ConfirmationResult,
    code: string
  ): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      const userCredential = await confirmation.confirm(code);
      return userCredential;
    } catch (error) {
      console.error('Firebase OTP Verification Error:', error);
      throw new Error('Invalid OTP code. Please try again.');
    }
  }

  /**
   * Gets the current Firebase User's secure ID Token.
   * We will send this token to your Frappe backend later!
   */
  static async getFirebaseIdToken(): Promise<string | null> {
    const user = auth().currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  /**
   * Authenticates the user with Google Sign-In natively and links it to Firebase.
   */
  static async signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      // 1. Ensure Google Play Services are available (Android only, no-op on iOS)
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // 2. Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      let idToken = signInResult.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found from Google Sign-In');
      }

      // 3. Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // 4. Sign-in the user with the credential in Firebase
      return await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }
}
