
import { AUTH_INFO } from '@/constants/auth.constant';
import { ENV } from '@/constants/env.constant';
import { ROUTES } from '@/constants/routes.constant';
import { IAuthInfo } from '@/interfaces/auth.interface';
import { LocalStorageService, isBrowser } from '@/services/storage.service';
import axios, { AxiosInstance } from 'axios';

export const createAxiosInstance = (token?: string | null): AxiosInstance => {
	const instance = axios.create({
		baseURL: ENV.API_GATEWAY,
		headers: {
			Accept: 'application/json',
			clientId: 'iifc-recruitment-client',
		},
	});

	if (token) {
		instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	}

	instance.interceptors.response.use(
		(res: any) => {
			if (res?.data?.status === 200) return { ...res.data };
			if (res?.data?.status === 401) {
				const currentUrl = res.config.url || '';
				if (!currentUrl.includes('/login') && !currentUrl.includes('/signup')) {
					logout();
				}
			}
			return Promise.reject({
				body: res.data?.body,
				status: res.data?.status,
				message: res.data?.message,
				error: res.data?.error,
			});
		},
		(error) => {
			if (error?.response) {
				const { data, status, config } = error.response;
				const currentUrl = config.url || '';

				if (status === 401 && !currentUrl.includes('/login') && !currentUrl.includes('/signup')) {
					logout();
				}

				if (data?.error) {
					try {
						const errorObj = JSON.parse(data.error);
						if (errorObj && typeof errorObj === 'object') {
							const messages = Object.values(errorObj).join('\n');
							if (messages) {
								return Promise.reject({ status, message: messages, body: {} });
							}
						}
					} catch (e) {
						// Not a JSON error, fall through
					}
				}

				if (data) {
					return Promise.reject({
						status,
						message: data?.message || data?.error || 'An unknown error occurred.',
						body: data?.body || {},
					});
				}
			}
			return Promise.reject({
				status: 500,
				message: 'Server not responding',
				body: {},
			});
		}
	);

	return instance;
};

export const getAuthenticatedAxios = (): AxiosInstance => {
	let token: string | null = null;
	if (isBrowser) {
		const authInfo: IAuthInfo | null = LocalStorageService.get(AUTH_INFO);
		token = authInfo?.access_token || null;
	}
	return createAxiosInstance(token);
};

export const setAuthHeader = (token?: string | null) => {
	axiosIns.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export let axiosIns = createAxiosInstance();

export const initializeAuthHeader = () => {
    if (isBrowser) {
        const authInfo: IAuthInfo | null = LocalStorageService.get(AUTH_INFO);
        const token = authInfo?.access_token || null;
        axiosIns = createAxiosInstance(token);
    }
}


const logout = () => {
	if (isBrowser) {
		if (window.location.pathname === ROUTES.AUTH.LOGIN) return;
		LocalStorageService.clear();
		window.location.href = ROUTES.AUTH.LOGIN;
	}
};
