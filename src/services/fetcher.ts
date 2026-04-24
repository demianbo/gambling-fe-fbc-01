type Result<T> = { data: T; error: null } | { data: null; error: string }

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<Result<T>> {
  const baseUrl = process.env.API_BASE_URL
  if (!baseUrl) {
    return { data: null, error: 'API_BASE_URL not configured' }
  }

  const url = `${baseUrl}${path}`

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body)
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      return { data: null, error: `HTTP ${response.status}: ${response.statusText}` }
    }

    const data = (await response.json()) as T
    return { data, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

export async function get<T>(path: string): Promise<Result<T>> {
  return request<T>('GET', path)
}

export async function post<T>(path: string, body: unknown): Promise<Result<T>> {
  return request<T>('POST', path, body)
}

export async function put<T>(path: string, body: unknown): Promise<Result<T>> {
  return request<T>('PUT', path, body)
}

export async function del<T>(path: string): Promise<Result<T>> {
  return request<T>('DELETE', path)
}
