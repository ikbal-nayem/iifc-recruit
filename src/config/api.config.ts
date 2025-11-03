import { ACCESS_TOKEN } from '@/constants/auth.constant';
import { ENV } from '@/constants/env.constant';
import { ROUTES } from '@/constants/routes.constant';
import { clearAuthInfo, isBrowser } from '@/services/storage.service';
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
				withCredentials: true,
			},
		});

		this.setupInterceptors();
	}

	private async getAuthToken() {
		try {
			const cookieStore = await cookies();
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
		if (error?.response?.status === 401) {
			console.error("Authentication error: You are not authorized.")
		}

		return Promise.reject({
			status: error?.response?.status || 500,
			message: error?.response?.data?.message || 'Server not responding',
			body: {},
		});
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
