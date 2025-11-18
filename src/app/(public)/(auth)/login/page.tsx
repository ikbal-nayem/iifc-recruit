import LoginForm from '@/components/app/public/auth/login-form';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations } from '@/lib/i18n-server';

export default async function LoginPage() {
	const t = await getTranslations();

	return (
		<Card className='w-full max-w-sm glassmorphism'>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl font-headline'>{t('auth.login.title')}</CardTitle>
				<CardDescription>{t('pages.contact.fillForm')}</CardDescription>
			</CardHeader>
			<LoginForm />
		</Card>
	);
}
