'use client';

import { setAuthToken } from '@/config/api.config';
import { ACCESS_TOKEN, AUTH_INFO, REFRESH_TOKEN } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { IAuthInfo, IUser } from '@/interfaces/auth.interface';
import { AuthService } from '@/services/api/auth.service';
import { clearAuthInfo, CookieService, LocalStorageService } from '@/services/storage.service';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
	currectUser: IUser | null;
	authInfo: IAuthInfo | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (username: string, password: string) => Promise<void | IUser>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [authInfo, setAuthInfo] = useState<IAuthInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const logout = () => {
		nProgress.start();
		AuthService.logout()
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				setUser(null);
				setAuthInfo(null);
				setAuthToken();
				clearAuthInfo();
				router.push(ROUTES.AUTH.LOGIN);
				nProgress.done();
			});
	};

	useEffect(() => {
		const loadUserFromStorage = async () => {
			const storedAuthInfo = LocalStorageService.get(AUTH_INFO);
			if (storedAuthInfo) {
				setAuthInfo(storedAuthInfo);
				setAuthToken(storedAuthInfo.access_token);
				try {
					const userProfileRes = await AuthService.getUserDetails();
					setUser(userProfileRes.body);
				} catch (error) {
					console.error('Failed to fetch user profile on load', error);
					logout(); // Log out if session is invalid
				}
			}
			setIsLoading(false);
		};

		loadUserFromStorage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const login = async (username: string, password: string) => {
		const response = await AuthService.login({ username, password });
		const newAuthInfo = response.body;
		setAuthInfo(newAuthInfo);
		setAuthToken(newAuthInfo.access_token);
		storeAuthInfo(newAuthInfo);

		try {
			const userProfileRes = await AuthService.getUserDetails();
			setUser(userProfileRes.body);
			return userProfileRes.body;
		} catch (error) {
			console.error('Failed to fetch user profile on login', error);
			// Handle error, maybe logout the user
		}
	};

	return (
		<AuthContext.Provider
			value={{
				currectUser: user,
				authInfo,
				isAuthenticated: !!user,
				isLoading,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

const storeAuthInfo = (authInfo: IAuthInfo) => {
	LocalStorageService.set(AUTH_INFO, authInfo);
	CookieService.set(ACCESS_TOKEN, authInfo.access_token, 1);
	CookieService.set(REFRESH_TOKEN, authInfo.refresh_token, 1);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
