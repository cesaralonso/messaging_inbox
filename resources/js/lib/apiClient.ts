const API_BASE_URL = '/api';

function getAuthToken(): string | null {
  return localStorage.getItem('api_token');
}

type RequestOptions = RequestInit & {
  auth?: boolean;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);

  finalHeaders.set('Accept', 'application/json');

  const hasBody =
    rest.body !== undefined &&
    rest.body !== null &&
    !(rest.body instanceof FormData);

  if (hasBody && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getAuthToken();

    if (token) {
      finalHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (!response.ok) {
    let errorMessage = 'Request failed.';

    try {
      const errorData = await response.json();
      errorMessage = errorData.message ?? errorMessage;
    } catch {
      //
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string, auth = false) =>
    request<T>(endpoint, { method: 'GET', auth }),

  post: <T>(endpoint: string, body?: unknown, auth = false) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      auth,
    }),

  patch: <T>(endpoint: string, body?: unknown, auth = false) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      auth,
    }),
};