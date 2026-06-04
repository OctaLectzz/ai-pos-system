import { RegisterForm } from '@/components/auth/register-form'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('auth.title')
  return {
    title: t('register')
  }
}

export default function RegisterPage() {
  return <RegisterForm />
}
