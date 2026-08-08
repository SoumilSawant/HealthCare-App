import { DEMO_MODE } from "./demo";

const GOOGLE_IDENTITY_SCRIPT = "https://accounts.google.com/gsi/client";
const GOOGLE_MEET_SPACES_ENDPOINT = "https://meet.googleapis.com/v2/spaces";
const GOOGLE_MEET_CREATE_SCOPE =
  "https://www.googleapis.com/auth/meetings.space.created";
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleTokenClient {
  requestAccessToken(options?: { prompt?: string }): void;
}

interface GoogleOAuthError {
  type?: string;
  message?: string;
}

interface GoogleIdentityServices {
  accounts: {
    oauth2: {
      initTokenClient(config: {
        client_id: string;
        scope: string;
        callback(response: GoogleTokenResponse): void;
        error_callback?(error: GoogleOAuthError): void;
      }): GoogleTokenClient;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

export interface GoogleMeetSpace {
  name: string;
  meetingUri: string;
  meetingCode?: string;
}

let identityScriptPromise: Promise<void> | undefined;

function loadGoogleIdentityServices() {
  if (window.google?.accounts.oauth2) return Promise.resolve();
  if (identityScriptPromise) return identityScriptPromise;

  identityScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_IDENTITY_SCRIPT}"]`
    );
    const script = existing ?? document.createElement("script");
    const timeout = window.setTimeout(() => {
      reject(new Error("Google authorization took too long to load. Please try again."));
    }, 10_000);

    const finish = () => {
      window.clearTimeout(timeout);
      if (window.google?.accounts.oauth2) {
        resolve();
      } else {
        reject(new Error("Google authorization could not be initialized."));
      }
    };
    const fail = () => {
      window.clearTimeout(timeout);
      identityScriptPromise = undefined;
      reject(new Error("Google authorization could not be loaded. Check your connection and try again."));
    };

    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", fail, { once: true });
    if (!existing) {
      script.src = GOOGLE_IDENTITY_SCRIPT;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return identityScriptPromise;
}

async function requestGoogleAccessToken() {
  if (!googleClientId) {
    throw new Error(
      "Google Meet is not configured. Add VITE_GOOGLE_CLIENT_ID to this deployment."
    );
  }

  await loadGoogleIdentityServices();
  return new Promise<string>((resolve, reject) => {
    const oauth = window.google?.accounts.oauth2;
    if (!oauth) {
      reject(new Error("Google authorization is unavailable. Please refresh and try again."));
      return;
    }

    const client = oauth.initTokenClient({
      client_id: googleClientId,
      scope: GOOGLE_MEET_CREATE_SCOPE,
      callback(response) {
        if (response.access_token) {
          resolve(response.access_token);
          return;
        }
        reject(
          new Error(
            response.error_description ||
              "Google Meet access was not granted. Choose a Google account and allow meeting creation."
          )
        );
      },
      error_callback(error) {
        reject(
          new Error(
            error.message ||
              (error.type === "popup_closed"
                ? "Google authorization was closed before it finished."
                : "Google authorization could not be completed.")
          )
        );
      }
    });
    client.requestAccessToken({ prompt: "select_account" });
  });
}

export async function createGoogleMeetSpaceWithToken(accessToken: string) {
  const response = await fetch(GOOGLE_MEET_SPACES_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => undefined)) as
      | { error?: { message?: string } }
      | undefined;
    throw new Error(
      payload?.error?.message ||
        "Google Meet could not create the meeting. Confirm the Meet API is enabled and try again."
    );
  }

  const space = (await response.json()) as Partial<GoogleMeetSpace>;
  if (!space.name || !space.meetingUri) {
    throw new Error("Google Meet created an incomplete meeting space. Please try again.");
  }
  return space as GoogleMeetSpace;
}

export function isGoogleMeetLink(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "meet.google.com";
  } catch {
    return false;
  }
}

export const googleMeetApi = {
  isConfigured: () => DEMO_MODE || Boolean(googleClientId),
  async createSpace(): Promise<GoogleMeetSpace> {
    if (DEMO_MODE) {
      return {
        name: `spaces/demo-${Date.now()}`,
        meetingCode: "abc-defg-hij",
        meetingUri: "https://meet.google.com/abc-defg-hij"
      };
    }
    const accessToken = await requestGoogleAccessToken();
    return createGoogleMeetSpaceWithToken(accessToken);
  }
};
