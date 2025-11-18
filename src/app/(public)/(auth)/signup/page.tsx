import SignupForm from '@/components/app/public/auth/signup-form';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations } from '@/lib/i18n-server';

export default async function SignupPage() {
	const t = await getTranslations();

	return (
		<Card className='w-full max-w-sm glassmorphism'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl font-headline'>{t('auth.signup.title')}</CardTitle>
				<CardDescription>{t('auth.signup.description')}</CardDescription>
			</CardHeader>
			<SignupForm />
		</Card>
	);
}
