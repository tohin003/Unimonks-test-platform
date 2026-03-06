/**
 * Typed API client for frontend ↔ backend communication.
 * Auto-handles JSON parsing, error extraction, and provides typed methods.
 */

type ApiResponse<T> = { data: T; ok: true } | { error: string; code: string; message: string; ok: false; status: number }

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        })

        const json = await res.json()

        if (!res.ok) {
            return {
                ok: false,
                error: json.error || true,
                code: json.code || 'UNKNOWN',
                message: json.message || 'Something went wrong',
                status: res.status,
            }
        }

        return { data: json as T, ok: true }
    } catch (err) {
        return {
            ok: false,
            error: 'true',
            code: 'NETWORK_ERROR',
            message: err instanceof Error ? err.message : 'Network error',
            status: 0,
        }
    }
}

export const apiClient = {
    get<T>(url: string, params?: Record<string, string | number | undefined>) {
        const searchParams = new URLSearchParams()
        if (params) {
            Object.entries(params).forEach(([key, val]) => {
                if (val !== undefined && val !== '') searchParams.set(key, String(val))
            })
        }
        const queryString = searchParams.toString()
        const fullUrl = queryString ? `${url}?${queryString}` : url
        return request<T>(fullUrl, { method: 'GET' })
    },

    post<T>(url: string, body?: unknown) {
        return request<T>(url, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        })
    },

    patch<T>(url: string, body: unknown) {
        return request<T>(url, {
            method: 'PATCH',
            body: JSON.stringify(body),
        })
    },

    delete<T>(url: string) {
        return request<T>(url, { method: 'DELETE' })
    },
}
