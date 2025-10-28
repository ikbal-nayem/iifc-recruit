import SignupForm from '@/components/app/public/auth/signup-form';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
	return (
		<Card className='w-full max-w-sm glassmorphism'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl font-headline'>Create an Account</CardTitle>
				<CardDescription>Join our platform to find your next opportunity.</CardDescription>
			</CardHeader>
			<SignupForm />
		</Card>
	);
}
