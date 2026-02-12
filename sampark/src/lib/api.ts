/**
 * API Configuration
 * 
 * In development with proxy: Use empty string (routes to /api via proxy)
 * In development without proxy: Use http://localhost:3000
 * In production: Use VITE_API_URL from environment
 */

const isDevelopment = import.meta.env.DEV;
const API_URL_FROM_ENV = import.meta.env.VITE_API_URL;

/**
 * Get the base API URL
 * - In development, returns empty string to use Vite proxy
 * - In production, returns the configured API URL or empty string for relative paths
 */
export const getApiUrl = (): string => {
  // If explicitly set, use it
  if (API_URL_FROM_ENV) {
    return API_URL_FROM_ENV;
  }
  
  // In development, use proxy (empty string means relative paths)
  if (isDevelopment) {
    return '';
  }
  
  // In production, use relative paths (assumes frontend and backend are on same domain)
  return '';
};

export const API_URL = getApiUrl();

/**
 * Build a full API endpoint URL
 * @param path - API path (e.g., '/api/auth/login')
 * @returns Full URL
 */
export const buildApiUrl = (path: string): string => {
  const baseUrl = API_URL;
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // If baseUrl is empty, return just the path
  if (!baseUrl) {
    return normalizedPath;
  }
  
  // Remove trailing slash from baseUrl if present
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${normalizedBase}${normalizedPath}`;
};
