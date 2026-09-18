import { z } from "zod"

export const signInSchema = z.object({
  email: z.email("Entrez une adresse email valide"),
  password: z.string().min(1, "Entrez votre mot de passe"),
})

export type SignInFormData = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom"),
  email: z.email("Entrez une adresse email valide"),
  password: z
    .string()
    .min(8, "8 caractères minimum")
    .max(128, "128 caractères maximum"),
})

export type SignUpFormData = z.infer<typeof signUpSchema>

export const forgotPasswordSchema = z.object({
  email: z.email("Entrez une adresse email valide"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "8 caractères minimum")
      .max(128, "128 caractères maximum"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
