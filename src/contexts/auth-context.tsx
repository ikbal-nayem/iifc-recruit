'use client';

import { setAuthToken } from '@/config/api.config';
import { ACCESS_TOKEN, AUTH_INFO, REFRESH_TOKEN } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { IAuthInfo, IUser } from '@/interfaces/auth.interface';
import { AuthService } from '@/services/api/auth.service';
import { CookieService, LocalStorageService } from '@/services/storage.service';
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
			.then(() => {
				setUser(null);
				setAuthInfo(null);
				setAuthToken();
				LocalStorageService.delete(AUTH_INFO);
				CookieService.remove(ACCESS_TOKEN);
				CookieService.remove(REFRESH_TOKEN);
				router.push(ROUTES.AUTH.LOGIN);
			})
			.finally(() => nProgress.done());
	};

	useEffect(() => {
		const loadUserFromStorage = async () => {
			const storedAuthInfo = LocalStorageService.get(AUTH_INFO);
			if (storedAuthInfo) {
				setAuthInfo(storedAuthInfo);
				setAuthToken(storedAuthInfo.access_token);
				try {
					const userProfileRes = await AuthService.getUserProfile();
					setUser(userProfileRes.body);
				} catch (error) {
					console.error('Failed to fetch user profile on load', error);
					logout(); // Log out if session is invalid
				}
			}
			setIsLoading(false);
		};

		loadUserFromStorage();
	}, []);

	const login = async (username: string, password: string) => {
		const response = await AuthService.login({ username, password });
		const newAuthInfo = response.body;
		setAuthInfo(newAuthInfo);
		setAuthToken(newAuthInfo.access_token);
		LocalStorageService.set(AUTH_INFO, newAuthInfo);
		CookieService.set(ACCESS_TOKEN, newAuthInfo.access_token, 1);
		CookieService.set(REFRESH_TOKEN, newAuthInfo.refresh_token, 1);

		try {
			const userProfileRes = await AuthService.getUserProfile();
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

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
