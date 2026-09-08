/**
 * Client-Side Microsoft Identity & OAuth Helper for OneDrive / Microsoft Graph API
 */

export interface MicrosoftTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  error?: string;
}

/**
 * Initiates Microsoft OAuth Popup for OneDrive (Files.ReadWrite) access
 */
export async function requestMicrosoftAccessToken(
  scopes: string[] = ['Files.ReadWrite', 'User.Read']
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Standard Microsoft OAuth 2.0 Auth Code / Token Endpoint Popup
    const clientId = '00000000-0000-0000-0000-000000000000'; // Microsoft App ID Placeholder
    const redirectUri = window.location.origin;
    const scopeStr = encodeURIComponent(scopes.join(' '));

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopeStr}&login_hint=salibuoy.systems@outlook.com`;

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'Microsoft_OneDrive_Login',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
    );

    if (!popup) {
      reject(new Error('Popup blocked by browser. Please allow popups for OneDrive upload.'));
      return;
    }

    const checkInterval = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(checkInterval);
          reject(new Error('Microsoft login window closed before completing authentication.'));
          return;
        }

        if (popup.location.href.includes('access_token=')) {
          const hash = popup.location.hash || popup.location.search;
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          popup.close();
          clearInterval(checkInterval);

          if (accessToken) {
            resolve(accessToken);
          } else {
            reject(new Error('No access token found in Microsoft response.'));
          }
        }
      } catch (e) {
        // Cross-origin access until redirect back to origin
      }
    }, 500);
  });
}
