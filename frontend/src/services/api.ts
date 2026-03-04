export const API_BASE_URL = '/api';

export const api = {
    async get(endpoint: string) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },

    async post(endpoint: string, body: FormData | object) {
        const isFormData = body instanceof FormData;
        const headers = isFormData ? {} : { 'Content-Type': 'application/json' };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: isFormData ? (body as FormData) : JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    }
};
