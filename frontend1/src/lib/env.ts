const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const env = {
  apiBaseUrl: baseUrl || 'http://localhost:5000/api/v1',
};
