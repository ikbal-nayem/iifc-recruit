
'use client';

import { AUTH_INFO } from '@/constants/auth.constant';
import { IAuthInfo, IUser } from '@/interfaces/auth.interface';
import { AuthService } from '@/services/api/auth.service';
import { LocalStorageService } from '@/services/storage.service';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { setAuthHeader } from '@/config/api.config';

interface AuthContextType {
	user: IUser | null;
	authInfo: IAuthInfo | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [authInfo, setAuthInfo] = useState<IAuthInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const logout = () => {
		setUser(null);
		setAuthInfo(null);
		setAuthHeader();
		LocalStorageService.delete(AUTH_INFO);
	};

	useEffect(() => {
		const loadUserFromStorage = async () => {
			const storedAuthInfo = LocalStorageService.get(AUTH_INFO);
			if (storedAuthInfo) {
				setAuthInfo(storedAuthInfo);
				setAuthHeader(storedAuthInfo.access_token);
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
		setAuthHeader(newAuthInfo.access_token);
		LocalStorageService.set(AUTH_INFO, newAuthInfo);

		try {
			const userProfileRes = await AuthService.getUserProfile();
			setUser(userProfileRes.body);
		} catch (error) {
			console.error('Failed to fetch user profile on login', error);
			// Handle error, maybe logout the user
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
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
