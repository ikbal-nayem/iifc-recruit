import { ACCESS_TOKEN } from '@/constants/auth.constant';
import { ENV } from '@/constants/env.constant';
import { ROUTES } from '@/constants/routes.constant';
import { CookieService, LocalStorageService, isBrowser } from '@/services/storage.service';
import axios from 'axios';
const { cookies } = require('next/headers');

class AxiosInstance {
	private instance;

	constructor() {
		this.instance = axios.create({
			baseURL: ENV.API_GATEWAY,
			headers: {
				Accept: 'application/json',
				clientId: 'iifc-recruitment-client',
			},
		});

		this.setupInterceptors();
	}

	private async getAuthToken() {
		try {
			const cookieStore = await cookies()
			return cookieStore.get(ACCESS_TOKEN)?.value || null;
		} catch (e) {
			return null;
		}
	}

	private setupInterceptors() {
		this.instance.interceptors.request.use(
			async (config) => {
				const token = await this.getAuthToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(this.handleError(error));
			}
		);

		// Response interceptor (keep your existing logic)
		this.instance.interceptors.response.use(
			(res: any) => {
				if (res?.data?.status === 200) return { ...res.data };
				if (res?.data?.status === 401) this.logout();
				return Promise.reject({
					body: res.data.body,
					status: res.data.status,
					message: res.data.message,
					error: res.data.error,
				});
			},
			(error) => this.handleResponseError(error)
		);
	}

	private handleError(error: any) {
		if (error.response) {
			return {
				...error.response,
				status: error.response.status || error.status,
			};
		}

		return {
			body: false,
			status: 500,
			message: 'Server not responding',
		};
	}

	private handleResponseError(error: any) {
		// Your existing error handling logic
		if (error?.response) {
			const { data, status } = error.response;

			if (status === 401) {
				if (location.pathname !== ROUTES.AUTH.LOGIN) this.logout();
			}

			// ... rest of your error handling
		}

		return Promise.reject({
			status: 500,
			message: 'Server not responding',
			body: {},
		});
	}

	private logout() {
		if (isBrowser) {
			LocalStorageService.clear();
			CookieService.remove(ACCESS_TOKEN);
			window.location.href = ROUTES.AUTH.LOGIN;
		}
	}

	public getInstance() {
		return this.instance;
	}
}

export const axiosIns = new AxiosInstance().getInstance();
export const setAuthToken = (token?: string) => {
	if (token) {
		axiosIns.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	} else axiosIns.defaults.headers.common['Authorization'] = ``;
};
