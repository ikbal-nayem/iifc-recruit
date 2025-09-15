import { AUTH_INFO } from '@/constants/auth.constant';
import { ENV } from '@/constants/env.constant';
import { IAuthInfo } from '@/interfaces/auth.interface';
import { LocalStorageService } from '@/services/storage.service';
import axios from 'axios';

const axiosIns = axios.create({
	baseURL: ENV.API_GATEWAY,
	headers: {
		Accept: 'application/json',
	},
});

const setAuthHeader = (token?: string) => {
	if (!!token) {
		axiosIns.defaults.headers.common['Authorization'] = 'Bearer ' + token;
		return;
	}
	const authInfo: IAuthInfo = LocalStorageService.get(AUTH_INFO) || null;
	if (authInfo) axiosIns.defaults.headers.common['Authorization'] = 'Bearer ' + authInfo?.accessToken;
};

setAuthHeader();

axiosIns.interceptors.request.use(
	(config) => {
		// config.headers['udid'] = config?.headers?.['udid'] || getCookie('udid');
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
			if (error.response?.status === 401) logout();
			if (error.response?.data) {
				return Promise.reject({
					status: error.response?.status,
					message: error.response?.data?.message || error.response?.data?.error,
					body: {},
				});
			}
			return Promise.reject({
				message: error.message,
				status: error?.response?.status || error.status || 500,
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
	window.location.reload();
};

export { axiosIns, setAuthHeader };
