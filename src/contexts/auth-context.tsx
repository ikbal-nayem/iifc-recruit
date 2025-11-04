'use client';

import { setAuthToken } from '@/config/api.config';
import { ACCESS_TOKEN, AUTH_INFO, REFRESH_TOKEN } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { IAuthInfo, IUser } from '@/interfaces/auth.interface';
import { AuthService } from '@/services/api/auth.service';
import { UserService } from '@/services/api/user.service';
import { clearAuthInfo, CookieService, LocalStorageService, SessionStorageService } from '@/services/storage.service';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
	currectUser: IUser | null;
	updateUserInfo: (updatedUser: Partial<IUser>) => void;
	authInfo: IAuthInfo | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (username: string, password: string) => Promise<void | IUser>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const storeAuthInfo = (authInfo: IAuthInfo) => {
	LocalStorageService.set(AUTH_INFO, authInfo);
	CookieService.set(ACCESS_TOKEN, authInfo.access_token, 1);
	CookieService.set(REFRESH_TOKEN, authInfo.refresh_token, 1);
};


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
					const userProfileRes = await UserService.getUserDetails();
					setUser(userProfileRes.body);
				} catch (error) {
					console.error('Failed to fetch user profile on load', error);
					// The 401 interceptor in axios will handle logout
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
		storeAuthInfo(newAuthInfo);

		try {
			const userProfileRes = await UserService.getUserDetails();
			const loggedInUser = userProfileRes.body;
			setUser(loggedInUser);

			const redirectUrl = SessionStorageService.get('redirectUrl');
			SessionStorageService.delete('redirectUrl');
			
			if (redirectUrl) {
				router.push(redirectUrl);
			} else {
				// Default redirection logic based on user type
				if (loggedInUser.userType === 'JOB_SEEKER') {
					router.push(ROUTES.DASHBOARD.JOB_SEEKER);
				} else {
					router.push(ROUTES.DASHBOARD.ADMIN);
				}
			}
			return loggedInUser;
		} catch (error) {
			console.error('Failed to fetch user profile on login', error);
			// Handle error, maybe logout the user
		}
	};

	const updateUserInfo = (updatedUser: Partial<IUser>) => {
		setUser(prev => ({ ...prev, ...updatedUser}) as IUser);
	};


	return (
		<AuthContext.Provider
			value={{
				currectUser: user,
				updateUserInfo,
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