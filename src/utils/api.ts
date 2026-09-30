/**
 * Safe API client that protects against:
 * 1. Cloud Run / Proxy cold boot HTML error responses ("The page cannot be displayed", "The page could not be found")
 * 2. Non-JSON responses throwing "Unexpected token 'T', ... is not valid JSON"
 * 3. Network interruptions with automatic retry
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  notice?: string;
  source?: string;
  seasonalCalendar?: any;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit,
  retries = 2
): Promise<ApiResponse<T>> {
  let attempt = 0;

  while (attempt <= retries) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...(options?.headers || {})
        }
      });

      const contentType = res.headers.get('content-type') || '';

      // Check if response is HTML or plain text (e.g. Cloud Run 502/503/404 or Vite proxy error)
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        console.warn(`[API] Received non-JSON response from ${url} (Status ${res.status}):`, text.slice(0, 120));

        // If server is waking up or deploying (502/503/504), retry after a short delay
        if ((res.status >= 500 || res.status === 404 || text.includes('The page')) && attempt < retries) {
          attempt++;
          await new Promise(r => setTimeout(r, 1200 * attempt));
          continue;
        }

        return {
          success: false,
          error: `Server sedang menyiapkan respon atau memulai ulang (${res.status}). Silakan coba klik tombol generate kembali.`
        };
      }

      // Safe JSON parse
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn(`[API] Fetch error for ${url} (Attempt ${attempt + 1}/${retries + 1}):`, err.message);

      if (attempt < retries) {
        attempt++;
        await new Promise(r => setTimeout(r, 1000 * attempt));
        continue;
      }

      return {
        success: false,
        error: 'Koneksi ke server terputus sesaat saat server memulai ulang. Silakan klik tombol Coba Lagi.'
      };
    }
  }

  return {
    success: false,
    error: 'Gagal terhubung ke server setelah beberapa percobaan. Silakan coba kembali.'
  };
}
