import { LoginForm } from '@/components/auth/login-form'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('auth.title')
  return {
    title: t('login')
  }
}

export default function LoginPage() {
  return <LoginForm />
}
