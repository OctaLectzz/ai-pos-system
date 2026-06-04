'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Link } from '@/i18n/routing'
import { MailCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const COUNTDOWN_TIME = 60

export default function VerifyEmailPage() {
  const t = useTranslations('auth.verifyEmail')
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const { checkVerificationStatus, isCheckingVerification, resendVerification, isResendingVerification } = useAuth()
  const [showNotVerified, setShowNotVerified] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const storedTarget = localStorage.getItem('verify_email_resend_target')
    if (storedTarget) {
      const targetTime = parseInt(storedTarget, 10)
      const remaining = Math.ceil((targetTime - Date.now()) / 1000)
      if (remaining > 0) {
        setCountdown(remaining)
      } else {
        localStorage.removeItem('verify_email_resend_target')
      }
    }
  }, [])

  useEffect(() => {
    if (countdown <= 0) {
      localStorage.removeItem('verify_email_resend_target')
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('verify_email_resend_target')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const handleCheckStatus = () => {
    setShowNotVerified(false)
    checkVerificationStatus(undefined, {
      onSuccess: (sessionData) => {
        if (!sessionData) {
          setShowNotVerified(true)
        }
      }
    })
  }

  const handleResend = () => {
    if (!email || countdown > 0) return

    resendVerification(email, {
      onSuccess: () => {
        const targetTime = Date.now() + COUNTDOWN_TIME * 1000
        localStorage.setItem('verify_email_resend_target', targetTime.toString())
        setCountdown(COUNTDOWN_TIME)
      }
    })
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8 text-center">
      <div className="flex justify-center">
        <div className="bg-primary/10 rounded-full p-6">
          <MailCheck className="text-primary h-12 w-12" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
          {email && <span className="text-foreground mt-2 block font-medium">{email}</span>}
        </p>
      </div>

      <div className="space-y-4">
        <Button className="w-full" size="lg" onClick={handleCheckStatus} disabled={isCheckingVerification}>
          {isCheckingVerification ? t('checking') : t('checkStatus')}
        </Button>

        {email && (
          <Button variant="outline" className="w-full" size="lg" onClick={handleResend} disabled={isResendingVerification || countdown > 0}>
            {countdown > 0 ? t('resendCountdown', { seconds: countdown }) : t('resend')}
          </Button>
        )}

        {showNotVerified && <p className="text-destructive text-sm font-medium">{t('notVerified')}</p>}
      </div>

      <div className="text-sm">
        <Link href="/login" className="text-primary font-medium hover:underline">
          {t('backToLogin')}
        </Link>
      </div>
    </div>
  )
}
