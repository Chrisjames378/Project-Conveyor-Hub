/**
 * Client-Side Google Identity Services (GIS) Helper for OAuth Token Acquisition
 */

let tokenClient: any = null;

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  error?: string;
}

/**
 * Ensures Google Identity Services script is loaded in window
 */
export function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('gsi-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.id = 'gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

/**
 * Initiates Client-Side OAuth Token popup for requested scopes
 */
export async function requestGoogleAccessToken(scopes: string[] = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/documents'
]): Promise<string> {
  await loadGsiScript();

  return new Promise((resolve, reject) => {
    try {
      const google = (window as any).google;
      if (!google?.accounts?.oauth2) {
        reject(new Error('Google Identity Services SDK failed to initialize.'));
        return;
      }

      // Note: In client-side popup flow, client_id can be left blank or initialized via GIS token client
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '271014101303-aistudio-applet.apps.googleusercontent.com', // Generic GIS client placeholder
        scope: scopes.join(' '),
        callback: (response: TokenResponse) => {
          if (response.error) {
            reject(new Error(response.error));
          } else if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('No access token returned from Google sign-in popup.'));
          }
        },
        error_callback: (err: any) => {
          reject(new Error(err?.message || 'Google OAuth error'));
        }
      });

      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err: any) {
      reject(err);
    }
  });
}
