
'use client';

import { AUTH_INFO } from '@/constants/auth.constant';
import { IAuthInfo, IUser } from '@/interfaces/auth.interface';
import { AuthService } from '@/services/api/auth.service';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
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

	useEffect(() => {
		const loadUserFromStorage = async () => {
			const storedAuthInfo = LocalStorageService.get(AUTH_INFO);
			if (storedAuthInfo) {
				setAuthInfo(storedAuthInfo);
				setAuthHeader(storedAuthInfo.accessToken);
				const userType = storedAuthInfo.userType;
				let profile: Partial<IUser> = { ...storedAuthInfo };

				if (userType === 'JOB_SEEKER') {
					try {
						const profileRes = await JobseekerProfileService.personalInfo.get();
						profile = { ...profile, ...profileRes.body };
					} catch (e) {
						console.error('Failed to fetch jobseeker profile');
					}
				} else {
					profile = {
						firstName: 'Admin',
						lastName: 'User',
						email: storedAuthInfo.username,
					};
				}
				setUser(profile as IUser);
			}
			setIsLoading(false);
		};

		loadUserFromStorage();
	}, []);

	const login = async (username: string, password: string) => {
		const response = await AuthService.login({ username, password });
		const newAuthInfo = response.body;
		setAuthInfo(newAuthInfo);
		setAuthHeader(newAuthInfo.accessToken);
		LocalStorageService.set(AUTH_INFO, newAuthInfo);

		let profile: Partial<IUser> = { ...newAuthInfo };
		if (newAuthInfo.userType === 'JOB_SEEKER') {
			try {
				const profileRes = await JobseekerProfileService.personalInfo.get();
				profile = { ...profile, ...profileRes.body };
			} catch (e) {
				console.error('Failed to fetch jobseeker profile on login');
			}
		} else {
			profile = {
				firstName: 'Admin',
				lastName: 'User',
				email: newAuthInfo.username,
			};
		}
		setUser(profile as IUser);
	};

	const logout = () => {
		setUser(null);
		setAuthInfo(null);
		setAuthHeader();
		LocalStorageService.delete(AUTH_INFO);
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
