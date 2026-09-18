export type ActionResult =
  | { success: true; message?: string }
  | { success: false; message: string }

export const ok = (message?: string): ActionResult => ({ success: true, message })
export const fail = (message: string): ActionResult => ({ success: false, message })
