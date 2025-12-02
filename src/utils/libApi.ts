const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

const libApi = {
  async get(endpoint: string) {
    const token = getAuthToken();
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok) throw new Error(`GET ${endpoint} failed`);
    return response.json();
  },

  async post(endpoint: string, body: unknown) {
    const token = getAuthToken();
    const response = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`POST ${endpoint} failed`);
    return response.json();
  },
};

export default libApi;
