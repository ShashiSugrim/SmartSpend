// API utility functions for SmartSpend

const API_BASE_URL = 'http://localhost:3000';

/**
 * Sign up a new user
 */
export async function signupUser(email: string, password: string, income: string) {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            income
        }),
    });

    if (!response.ok) {
        if (response.status === 409 || response.status === 400) {
            throw new Error('EMAIL_ALREADY_USED');
        }
        throw new Error('SIGNUP_FAILED');
    }

    return response;
}

/**
 * Login a user and return the access token
 */
export async function loginUser(email: string, password: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password
        }),
    });

    if (!response.ok) {
        throw new Error('LOGIN_FAILED');
    }

    const data = await response.json();
    return data.access_token;
}

/**
 * Store access token and user email in localStorage
 */
export function storeAccessToken(token: string, email?: string) {
    localStorage.setItem('accessToken', token);
    if (email) {
        localStorage.setItem('userEmail', email);
    }
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
}

/**
 * Get user email from localStorage
 */
export function getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
}

/**
 * Remove access token and user email from localStorage (logout)
 */
export function clearAccessToken() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return getAccessToken() !== null;
}
