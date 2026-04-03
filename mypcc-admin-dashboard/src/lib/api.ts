/**
 * PCC Secure Backend API Client
 * This utility handles communication between the Next.js Frontend and the Spring Boot Engine.
 */

// Direct IP is much faster on Windows to avoid 'localhost' resolution delays
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8080';

// Super Admin Credentials for internal server-to-server communication
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';
const AUTH_TOKEN = typeof window === 'undefined' ? Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString('base64') : btoa(`${ADMIN_USER}:${ADMIN_PASS}`);

interface FetchOptions extends RequestInit {
    revalidate?: number;
}

export async function fetchFromBackend<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const url = `${BACKEND_URL}${path}`;
    
    const controller = new AbortController();
    const isWrite = options.method && options.method !== "GET";
    const timeoutMs = isWrite ? 30000 : 10000; // 30s for writes, 10s for reads
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const defaultHeaders = {
            'Authorization': `Basic ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
        };

        const res = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            next: {
                revalidate: options.revalidate ?? 0,
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Backend Error (${res.status}): ${errorText || res.statusText}`);
        }

        return res.json() as Promise<T>;
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Upload a file to the Spring Boot backend.
 * @param file The file object from input
 * @returns Object containing the uploaded file URL
 */
export async function uploadToBackend(file: File): Promise<{ url: string }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                // Return the base64 encoded string directly as the 'url'
                resolve({ url: reader.result });
            } else {
                reject(new Error("Failed to encode image to base64"));
            }
        };
        reader.onerror = () => reject(reader.error);
        
        // Read the file as a data URL (base64 string)
        reader.readAsDataURL(file);
    });
}
