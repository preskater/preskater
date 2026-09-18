"use server"

import { contactSchema, type ContactFormData } from "@/lib/schemas/contact"

export type ContactActionResult =
  | { success: true }
  | { success: false; message: string }

export async function submitContact(
  data: ContactFormData
): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      message: "Les informations envoyées sont invalides. Merci de les vérifier.",
    }
  }

  // TODO: send the request by email (Resend, Nodemailer, ...) or persist it.
  if (process.env.NODE_ENV !== "production") {
    console.log("Contact request:", parsed.data)
  }

  return { success: true }
}
