import { useRouter } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { LoginInput, RegisterInput } from '@/schemas/auth.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function useAuth() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const router = useRouter()
  const t = useTranslations('auth.toast')

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession()
      return data.session
    }
  })

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser()
      return data.user
    }
  })

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success(t('loginSuccess'))
      router.push('/dashboard')
    },
    onError: (error) => {
      toast.error(t('loginFailed'))
      console.error('Login error:', error.message)
    }
  })

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterInput) => {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name
          }
        }
      })

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: () => {
      toast.success(t('registerSuccess'))
      router.push('/dashboard')
    },
    onError: (error) => {
      toast.error(t('registerFailed'))
      console.error('Register error:', error.message)
    }
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.push('/login')
    }
  })

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`
      }
    })

    if (error) {
      toast.error(t('loginFailed'))
      console.error('Google login error:', error.message)
    }
  }

  return {
    session,
    user,
    isLoading: isSessionLoading || isUserLoading,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    loginWithGoogle
  }
}
