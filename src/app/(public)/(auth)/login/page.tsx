import LoginForm from '@/components/app/public/auth/login-form';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
	return (
		<Card className='w-full max-w-sm glassmorphism'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl font-headline'>Welcome Back!</CardTitle>
				<CardDescription>Enter your credentials to access your account.</CardDescription>
			</CardHeader>
			<LoginForm />
		</Card>
	);
}
