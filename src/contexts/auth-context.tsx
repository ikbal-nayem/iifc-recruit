
'use client';

import { initializeAuthHeader, setAuthHeader } from '@/config/api.config';
import { AUTH_INFO } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { IAuthInfo, IUser } from '@/interfaces/auth.interface';
import { AuthService } from '@/services/api/auth.service';
import { LocalStorageService } from '@/services/storage.service';
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

const setCookie = (name: string, value: string, days: number) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}


export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [authInfo, setAuthInfo] = useState<IAuthInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const logout = () => {
		nProgress.start();
		AuthService.logout()
			.catch((e) => console.error('Logout failed but proceeding', e))
			.finally(() => {
				setUser(null);
				setAuthInfo(null);
				initializeAuthHeader();
				LocalStorageService.delete(AUTH_INFO);
                setCookie(AUTH_INFO, '', -1);
				router.push(ROUTES.AUTH.LOGIN);
				nProgress.done();
			});
	};

	useEffect(() => {
		const loadUserFromStorage = async () => {
			const storedAuthInfo = LocalStorageService.get(AUTH_INFO);
			if (storedAuthInfo) {
				setAuthInfo(storedAuthInfo);
				initializeAuthHeader();
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
		initializeAuthHeader();
		LocalStorageService.set(AUTH_INFO, newAuthInfo);
		setCookie(AUTH_INFO, JSON.stringify(newAuthInfo), 7);


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
