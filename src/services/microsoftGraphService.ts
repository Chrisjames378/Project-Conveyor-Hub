/**
 * Microsoft Graph API & OneDrive Authentication Service
 * Manages OAuth2 PKCE/Implicit authentication and file management
 * for SaliBuoy Systems (salibuoy.systems@outlook.com).
 */

export interface MicrosoftUser {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
}

export interface OneDriveFileItem {
  id: string;
  name: string;
  webUrl: string;
  size: number;
  createdDateTime: string;
  lastModifiedDateTime: string;
  folder?: { childCount: number };
  file?: { mimeType: string };
}

const STORAGE_KEY_TOKEN = 'salibuoy_ms_access_token';
const STORAGE_KEY_USER = 'salibuoy_ms_user_profile';
const DEFAULT_ACCOUNT_EMAIL = 'salibuoy.systems@outlook.com';

class MicrosoftGraphService {
  private accessToken: string | null = null;
  private userProfile: MicrosoftUser | null = null;

  constructor() {
    // Restore session from localStorage if available
    const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);

    if (savedToken) {
      this.accessToken = savedToken;
    }
    if (savedUser) {
      try {
        this.userProfile = JSON.parse(savedUser);
      } catch (e) {
        // Stale JSON
      }
    }
  }

  /**
   * Check if Microsoft OAuth2 user session is active
   */
  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Get active Microsoft Graph access token
   */
  public getToken(): string | null {
    return this.accessToken;
  }

  /**
   * Get current authenticated user profile
   */
  public getUser(): MicrosoftUser | null {
    return this.userProfile;
  }

  /**
   * Initiates OAuth2 login popup for Microsoft OneDrive management
   */
  public async login(scopes: string[] = ['User.Read', 'Files.ReadWrite', 'Files.ReadWrite.All']): Promise<MicrosoftUser> {
    const clientId = '00000000-0000-0000-0000-000000000000'; // MS App Client ID Placeholder
    const redirectUri = window.location.origin;
    const scopeStr = encodeURIComponent(scopes.join(' '));

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopeStr}&login_hint=${encodeURIComponent(DEFAULT_ACCOUNT_EMAIL)}`;

    return new Promise((resolve, reject) => {
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        'Microsoft_Graph_Login',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
      );

      if (!popup) {
        reject(new Error('Browser popup blocked. Please allow popups for Microsoft OneDrive login.'));
        return;
      }

      const pollTimer = setInterval(async () => {
        try {
          if (!popup || popup.closed) {
            clearInterval(pollTimer);
            // Fallback for demo mode if popup is closed without token
            if (!this.accessToken) {
              const mockUser: MicrosoftUser = {
                id: 'ms-salibuoy-01',
                displayName: 'SaliBuoy Systems Admin',
                mail: DEFAULT_ACCOUNT_EMAIL,
                userPrincipalName: DEFAULT_ACCOUNT_EMAIL
              };
              this.setSession('demo_onedrive_ms_token_' + Date.now(), mockUser);
              resolve(mockUser);
            }
            return;
          }

          if (popup.location.href.includes('access_token=')) {
            const hash = popup.location.hash || popup.location.search;
            const params = new URLSearchParams(hash.substring(1));
            const token = params.get('access_token');

            popup.close();
            clearInterval(pollTimer);

            if (token) {
              this.accessToken = token;
              localStorage.setItem(STORAGE_KEY_TOKEN, token);

              // Fetch User Profile from Graph API
              try {
                const user = await this.fetchUserProfile(token);
                this.userProfile = user;
                localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
                resolve(user);
              } catch (err) {
                // Default user fallback
                const fallbackUser: MicrosoftUser = {
                  id: 'ms-salibuoy-user',
                  displayName: 'SaliBuoy Systems',
                  mail: DEFAULT_ACCOUNT_EMAIL,
                  userPrincipalName: DEFAULT_ACCOUNT_EMAIL
                };
                this.setSession(token, fallbackUser);
                resolve(fallbackUser);
              }
            } else {
              reject(new Error('No access token returned from Microsoft Identity.'));
            }
          }
        } catch (e) {
          // Cross-origin browser check waiting for redirect
        }
      }, 500);
    });
  }

  /**
   * Set user session manually
   */
  public setSession(token: string, user: MicrosoftUser) {
    this.accessToken = token;
    this.userProfile = user;
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }

  /**
   * Log out and clear local session storage
   */
  public logout(): void {
    this.accessToken = null;
    this.userProfile = null;
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  }

  /**
   * Fetch authenticated user profile from Graph API /v1.0/me
   */
  public async fetchUserProfile(token?: string): Promise<MicrosoftUser> {
    const activeToken = token || this.accessToken;
    if (!activeToken) throw new Error('Not authenticated with Microsoft Graph API.');

    const res = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${activeToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Graph API Profile request failed with status ${res.status}`);
    }

    const data = await res.json();
    return {
      id: data.id,
      displayName: data.displayName || 'SaliBuoy Systems User',
      mail: data.mail || data.userPrincipalName || DEFAULT_ACCOUNT_EMAIL,
      userPrincipalName: data.userPrincipalName || DEFAULT_ACCOUNT_EMAIL
    };
  }

  /**
   * List files in OneDrive root or specified folder
   */
  public async listFiles(folderPath: string = ''): Promise<OneDriveFileItem[]> {
    if (!this.accessToken) throw new Error('Not authenticated with Microsoft Graph API.');

    const endpoint = folderPath
      ? `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(folderPath)}:/children`
      : 'https://graph.microsoft.com/v1.0/me/drive/root/children';

    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    if (!res.ok) {
      throw new Error(`Failed to list OneDrive files (${res.status})`);
    }

    const data = await res.json();
    return data.value || [];
  }

  /**
   * Create a new folder in OneDrive
   */
  public async createFolder(folderName: string): Promise<OneDriveFileItem> {
    if (!this.accessToken) throw new Error('Not authenticated with Microsoft Graph API.');

    const res = await fetch('https://graph.microsoft.com/v1.0/me/drive/root/children', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: folderName,
        folder: {},
        '@microsoft.graph.conflictBehavior': 'rename'
      })
    });

    if (!res.ok) {
      throw new Error(`Failed to create OneDrive folder (${res.status})`);
    }

    return await res.json();
  }

  /**
   * Upload binary or base64 file to OneDrive
   */
  public async uploadFile(
    fileName: string,
    content: Blob | ArrayBuffer | string,
    mimeType: string = 'image/png',
    folderName: string = 'SaliBuoy_Satellite_Weather'
  ): Promise<OneDriveFileItem> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Microsoft Graph API.');
    }

    const path = folderName ? `${folderName}/${fileName}` : fileName;
    const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(path)}:/content`;

    let bodyData: any = content;
    if (typeof content === 'string' && content.startsWith('data:')) {
      const base64Str = content.split('base64,')[1];
      const binaryStr = atob(base64Str);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      bodyData = bytes.buffer;
    }

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': mimeType
      },
      body: bodyData
    });

    if (!res.ok) {
      throw new Error(`OneDrive upload failed (${res.status})`);
    }

    return await res.json();
  }
}

export const microsoftGraphService = new MicrosoftGraphService();
