
import { AUTH_INFO } from '@/constants/auth.constant';
import { ENV } from '@/constants/env.constant';
import { IAuthInfo } from '@/interfaces/auth.interface';
import { LocalStorageService, isBrowser } from '@/services/storage.service';
import axios from 'axios';

const axiosIns = axios.create({
	baseURL: ENV.API_GATEWAY,
	headers: {
		Accept: 'application/json',
		'clientId': 'iifc-recruitment-client',
	},
});

const setAuthHeader = (token?: string) => {
	if (!!token) {
		axiosIns.defaults.headers.common['Authorization'] = 'Bearer ' + token;
		return;
	}
	const authInfo: IAuthInfo = LocalStorageService.get(AUTH_INFO) || null;
	if (authInfo) axiosIns.defaults.headers.common['Authorization'] = 'Bearer ' + authInfo?.access_token;
};

const initializeAuthHeader = () => {
    if (isBrowser) {
        setAuthHeader();
    }
}

axiosIns.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		if (error.response) {
			return Promise.reject({
				...error.response,
				...{ status: error.response.status || error.status },
			});
		}

		return Promise.reject({
			body: false,
			status: 500,
			message: 'Server not responding',
		});
	}
);

axiosIns.interceptors.response.use(
	(res: any) => {
		if (res?.data?.status === 200) return { ...res.data };
		if (res?.data?.status === 401) logout();
		return Promise.reject({
			body: res.data.body,
			status: res.data.status,
			message: res.data.message,
			error: res.data.error,
		});
	},
	(error) => {
		if (error?.response) {
			const { config, data, status } = error.response;
			const isAuthRoute = config.url.includes('/api/auth/login') || config.url.includes('/auth/signup');

			// Only trigger global logout for non-auth routes on 401
			if (status === 401 && !isAuthRoute) {
				logout();
			}

			if (data?.error) {
				try {
					const errorObj = JSON.parse(data.error);
					if (errorObj && typeof errorObj === 'object') {
						const messages = Object.values(errorObj).join('\n');
						if (messages) {
							return Promise.reject({
								status: status,
								message: messages,
								body: {},
							});
						}
					}
				} catch (e) {
					// Not a JSON error, fall through to default handling
				}
			}

			if (data) {
				return Promise.reject({
					status: status,
					message: data?.message || data?.error || 'An unknown error occurred.',
					body: data?.body || {},
				});
			}

			return Promise.reject({
				message: error.message,
				status: status || error.status || 500,
			});
		} else {
			return Promise.reject({
				status: 500,
				message: 'Server not responding',
				body: {},
			});
		}
	}
);

const logout = () => {
	LocalStorageService.clear();
	if (isBrowser) {
		window.location.href = '/login';
	}
};

export { axiosIns, setAuthHeader, initializeAuthHeader };
