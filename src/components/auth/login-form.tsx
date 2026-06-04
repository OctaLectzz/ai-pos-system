'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { Link } from '@/i18n/routing'
import { LoginInput, loginSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useForm } from 'react-hook-form'

export function LoginForm() {
  const t = useTranslations('auth')
  const { login, isLoggingIn, loginWithGoogle } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  function onSubmit(values: LoginInput) {
    login(values)
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t('title.login')}</h1>
        <p className="text-muted-foreground">{t('subtitle.login')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">{t('label.email')}</FieldLabel>
            <Input id="email" placeholder={t('placeholder.email')} {...register('email')} disabled={isLoggingIn} />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">{t('label.password')}</FieldLabel>
            <Input id="password" type="password" placeholder={t('placeholder.password')} {...register('password')} disabled={isLoggingIn} />
            <FieldError errors={[errors.password]} />
          </Field>

          <Button type="submit" className="mt-2 w-full" disabled={isLoggingIn}>
            {isLoggingIn ? t('button.loggingIn') : t('button.login')}
          </Button>
        </FieldGroup>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">{t('prompt.or')}</span>
        </div>
      </div>

      <Button variant="outline" type="button" className="w-full" disabled={isLoggingIn} onClick={loginWithGoogle}>
        <Image src="/icons/google.svg" alt="Google" width={16} height={16} className="mr-2" />
        {t('button.google')}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('prompt.noAccount')} </span>
        <Link href="/register" className="text-primary font-medium hover:underline">
          {t('prompt.registerLink')}
        </Link>
      </div>
    </div>
  )
}
