"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LoaderIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { ActionResult } from "@/lib/crm/types"

export function DeleteButton({
  id,
  name,
  action,
  label = "Supprimer",
  iconOnly = true,
}: {
  id: string
  name: string
  action: (id: string) => Promise<ActionResult>
  label?: string
  iconOnly?: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  async function onConfirm(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    setPending(true)
    const result = await action(id)
    setPending(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message ?? "Supprimé.")
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button
        variant="ghost"
        size={iconOnly ? "icon-sm" : "sm"}
        className="text-muted-foreground hover:text-destructive"
        onClick={() => setOpen(true)}
        aria-label={`Supprimer ${name}`}
      >
        <Trash2Icon />
        {!iconOnly && label}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer «&nbsp;{name}&nbsp;» ? Cette action
              est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={pending}
              className="bg-destructive/10 text-destructive hover:bg-destructive/20"
            >
              {pending && <LoaderIcon className="animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
