import { ACCESS_TOKEN, AUTH_INFO, REFRESH_TOKEN } from '@/constants/auth.constant';
import { ENV } from '@/constants/env.constant';
import { clearAuthInfo, CookieService, LocalStorageService } from '@/services/storage.service';
import axios from 'axios';
const { cookies } = require('next/headers');

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

const handleLogout = () => {
	clearAuthInfo();
	failedQueue = [];
	isRefreshing = false;
	if (typeof window !== 'undefined') {
		window.location.href = '/login';
	}
};

class AxiosInstance {
	private instance;

	constructor() {
		this.instance = axios.create({
			baseURL: ENV.API_GATEWAY,
			headers: {
				Accept: 'application/json',
				clientId: 'iifc-recruitment-client',
				withCredentials: true,
			},
		});
		this.setupInterceptors();
	}

	private async getAuthToken(tokenType: typeof ACCESS_TOKEN | typeof REFRESH_TOKEN) {
		try {
			const cookieStore = await cookies();
			return cookieStore.get(tokenType)?.value || null;
		} catch (e) {
			return null;
		}
	}

	private setupInterceptors() {
		this.instance.interceptors.request.use(
			async (config) => {
				const token = await this.getAuthToken(ACCESS_TOKEN);
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		this.instance.interceptors.response.use(
			(res: any) => {
				if (res?.data?.status === 200) return { ...res.data };
				return Promise.reject({
					body: res.data.body,
					status: res.data.status,
					message: res.data.message,
					error: res.data.error,
				});
			},
			async (error) => {
				const originalRequest = error.config;
				if (error?.response?.status === 401 && !originalRequest._retry) {
					if (isRefreshing) {
						return new Promise(function (resolve, reject) {
							failedQueue.push({ resolve, reject });
						})
							.then((token) => {
								originalRequest.headers['Authorization'] = 'Bearer ' + token;
								return axios(originalRequest);
							})
							.catch((err) => Promise.reject(err));
					}

					originalRequest._retry = true;
					isRefreshing = true;

					const refreshToken = await this.getAuthToken(REFRESH_TOKEN);
					if (!refreshToken) {
						handleLogout();
						return Promise.reject(error);
					}

					return new Promise((resolve, reject) => {
						axios
							.post(`${ENV.API_GATEWAY}/api/auth/refresh`, { refreshToken })
							.then(({ data }) => {
								const newAuthInfo = data.body;
								try{
									LocalStorageService.set(AUTH_INFO, newAuthInfo);
									CookieService.set(ACCESS_TOKEN, newAuthInfo.access_token, 1);
								} catch(err) {
									console.info('Failed to store auth info after refresh from server:', err);
									cookies.set(REFRESH_TOKEN, newAuthInfo.refresh_token, { httpOnly: true, path: '/' });
									cookies.set(ACCESS_TOKEN, newAuthInfo.access_token, { httpOnly: true, path: '/' });
								}
								this.instance.defaults.headers.common['Authorization'] = 'Bearer ' + newAuthInfo.access_token;
								originalRequest.headers['Authorization'] = 'Bearer ' + newAuthInfo.access_token;
								processQueue(null, newAuthInfo.access_token);
								resolve(this.instance(originalRequest));
							})
							.catch((err) => {
								processQueue(err, null);
								handleLogout();
								reject(err);
							})
							.finally(() => (isRefreshing = false));
					});
				}

				return Promise.reject({
					status: error?.response?.status || 500,
					message: error?.response?.data?.message || 'Server not responding',
					body: {},
				});
			}
		);
	}

	public getInstance() {
		return this.instance;
	}
}

export const axiosIns = new AxiosInstance().getInstance();
export const setAuthToken = (token?: string) => {
	if (token) {
		axiosIns.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	} else {
		delete axiosIns.defaults.headers.common['Authorization'];
	}
};
