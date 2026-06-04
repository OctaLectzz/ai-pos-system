'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { Link } from '@/i18n/routing'
import { RegisterInput, registerSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useForm } from 'react-hook-form'

export function RegisterForm() {
  const t = useTranslations('auth')
  const { register: registerAuth, isRegistering, loginWithGoogle } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  function onSubmit(values: RegisterInput) {
    registerAuth(values)
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t('title.register')}</h1>
        <p className="text-muted-foreground">{t('subtitle.register')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name" required>
              {t('label.name')}
            </FieldLabel>
            <Input id="name" placeholder={t('placeholder.name')} {...register('name')} disabled={isRegistering} />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email" required>
              {t('label.email')}
            </FieldLabel>
            <Input id="email" placeholder={t('placeholder.email')} {...register('email')} disabled={isRegistering} />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="password" required>
              {t('label.password')}
            </FieldLabel>
            <Input id="password" type="password" placeholder={t('placeholder.password')} {...register('password')} disabled={isRegistering} />
            <FieldError errors={[errors.password]} />
          </Field>

          <Button type="submit" className="mt-2 w-full" disabled={isRegistering}>
            {isRegistering ? t('button.registering') : t('button.register')}
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

      <Button variant="outline" type="button" className="w-full" disabled={isRegistering} onClick={loginWithGoogle}>
        <Image src="/icons/google.svg" alt="Google" width={16} height={16} className="mr-2" />
        {t('button.google')}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('prompt.hasAccount')} </span>
        <Link href="/login" className="text-primary font-medium hover:underline">
          {t('prompt.loginLink')}
        </Link>
      </div>
    </div>
  )
}
