import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('auth.validation.email.invalid').min(1, 'auth.validation.email.required'),
  password: z.string().min(1, 'auth.validation.password.required')
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(2, 'auth.validation.name.minLength').max(50, 'auth.validation.name.maxLength'),
  email: z.string().email('auth.validation.email.invalid').min(1, 'auth.validation.email.required'),
  password: z
    .string()
    .min(8, 'auth.validation.password.minLength')
    .regex(/[A-Z]/, 'auth.validation.password.uppercase')
    .regex(/[a-z]/, 'auth.validation.password.lowercase')
    .regex(/[0-9]/, 'auth.validation.password.number')
    .regex(/[^A-Za-z0-9]/, 'auth.validation.password.special')
})

export type RegisterInput = z.infer<typeof registerSchema>
