"use client";

export const isBrowser = typeof window !== 'undefined';
export const isServer = typeof window === 'undefined';

export const LocalStorageService = {
	set: (key: string, value: any): void => {
        if (isBrowser) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },
	get: (key: string): any | null => {
        if (isBrowser) {
            return JSON.parse(localStorage.getItem(key) || 'null');
        }
        return null;
    },
	delete: (key: string): void => {
        if (isBrowser) {
            localStorage.removeItem(key);
        }
    },
	clear: (): void => {
        if (isBrowser) {
            localStorage.clear();
        }
    },
};

export const SessionStorageService = {
	set: (key: string, value: any): void => {
        if (isBrowser) {
            sessionStorage.setItem(key, JSON.stringify(value));
        }
    },
	get: (key: string): any | null => {
        if (isBrowser) {
            return JSON.parse(sessionStorage.getItem(key) || 'null');
        }
        return null;
    },
	delete: (key: string): void => {
        if (isBrowser) {
            sessionStorage.removeItem(key);
        }
    },
	clear: (): void => {
        if (isBrowser) {
            sessionStorage.clear();
        }
    },
};
