import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom"),
  email: z.email("Entrez une adresse email valide"),
  company: z.string().trim().max(120, "120 caractères maximum").optional(),
  message: z
    .string()
    .trim()
    .min(20, "Décrivez votre besoin en quelques mots (20 caractères min.)")
    .max(2000, "2000 caractères maximum"),
})

export type ContactFormData = z.infer<typeof contactSchema>
